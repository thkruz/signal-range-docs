import { AstroError } from 'astro/errors';
import type { Element, Root } from 'hast';
import { rehype } from 'rehype';
import rehypeFormat from 'rehype-format';
import type { VFile } from 'vfile';

const prettyPrintProcessor = rehype().data('settings', { fragment: true }).use(rehypeFormat);
const prettyPrintHtml = (html: string) =>
	prettyPrintProcessor.processSync({ value: html }).toString();

interface ProcessOptions {
	interactive?: boolean;
	statusColors?: Record<string, 'success' | 'warning' | 'error' | 'info'>;
	title?: string;
}

/**
 * Extract text content from a node, excluding nested lists
 */
function getTextContent(node: Element): string {
	let text = '';
	for (const child of node.children) {
		if (child.type === 'text') {
			text += child.value;
		} else if (child.type === 'element' && child.tagName !== 'ul') {
			text += getTextContent(child);
		}
	}
	return text.trim();
}

/**
 * Extract nested list items (sub-items)
 */
function extractSubItems(node: Element): string[] {
	const subItems: string[] = [];
	for (const child of node.children) {
		if (child.type === 'element' && child.tagName === 'ul') {
			for (const li of child.children) {
				if (li.type === 'element' && li.tagName === 'li') {
					const text = getTextContent(li);
					if (text) subItems.push(text);
				}
			}
		}
	}
	return subItems;
}

/**
 * Parse a checklist item to extract label, status, sub-items, and aside
 */
function parseChecklistItem(node: Element, options: ProcessOptions) {
	const textContent = getTextContent(node);
	const subItems = extractSubItems(node);

	// Detect aside prefix pattern: [NOTE], [CAUTION], [WARNING]
	const asideMatch = textContent.match(/^\[(NOTE|CAUTION|WARNING)\]\s+(.+)$/);
	let aside: { type: string; content: string } | undefined;
	let processedText = textContent;

	if (asideMatch) {
		const [, asideType, asideText] = asideMatch;
		aside = {
			type: asideType.toLowerCase(),
			content: asideText.trim()
		};
		// Return early with just the aside, no label/status parsing needed
		return { label: '', status: '', statusColor: undefined, subItems, aside };
	}

	// Split on 2+ consecutive dots or an ellipsis to separate label from status
	const parts = processedText.split(/\.{2,}|…/);

	let label = '';
	let status = '';

	if (parts.length >= 2) {
		label = parts[0].trim();
		status = parts[1].trim();
	} else {
		label = processedText.trim();
	}

	// Determine status color
	let statusColor: string | undefined;
	if (status && options.statusColors) {
		statusColor = options.statusColors[status];
	}

	return { label, status, statusColor, subItems, aside };
}

/**
 * Transform a list item into the checklist HTML structure
 */
function transformListItem(
	node: Element,
	options: ProcessOptions,
	index: number
): Element {
	const { label, status, statusColor, subItems, aside } = parseChecklistItem(node, options);

	// Create the main item container - keep as <li> for semantic HTML
	const itemDiv: Element = {
		type: 'element',
		tagName: 'li',
		properties: {
			className: ['sl-checklist-item'],
			...(options.interactive && { 'data-item-index': index }),
		},
		children: [],
	};

	// If this is an aside item, only render the aside (no checkbox or label/status)
	if (aside) {
		const asideDiv: Element = {
			type: 'element',
			tagName: 'div',
			properties: {
				className: ['sl-checklist-aside'],
				dataType: aside.type,
			},
			children: [{ type: 'text', value: aside.content }],
		};
		itemDiv.children.push(asideDiv);
		(itemDiv.properties.className as string[]).push('sl-checklist-item-aside-only');
		return itemDiv;
	}

	// Add checkbox if interactive
	if (options.interactive) {
		const checkbox: Element = {
			type: 'element',
			tagName: 'input',
			properties: {
				type: 'checkbox',
				className: ['sl-checklist-checkbox'],
				'data-item-index': index,
			},
			children: [],
		};
		itemDiv.children.push(checkbox);
	}

	// Add label
	const labelSpan: Element = {
		type: 'element',
		tagName: 'span',
		properties: { className: ['sl-checklist-label'] },
		children: [{ type: 'text', value: label }],
	};
	itemDiv.children.push(labelSpan);

	// Add dots (if there's a status)
	if (status) {
		const dotsSpan: Element = {
			type: 'element',
			tagName: 'span',
			properties: { className: ['sl-checklist-dots'] },
			children: [],
		};
		itemDiv.children.push(dotsSpan);

		// Add status
		const statusSpan: Element = {
			type: 'element',
			tagName: 'span',
			properties: {
				className: ['sl-checklist-status'],
				dataColor: statusColor,
			},
			children: [{ type: 'text', value: status }],
		};
		itemDiv.children.push(statusSpan);
	}

	// Add sub-items if present
	if (subItems.length > 0) {
		const subItemsUl: Element = {
			type: 'element',
			tagName: 'ul',
			properties: { className: ['sl-checklist-subitems'] },
			children: subItems.map((item) => ({
				type: 'element',
				tagName: 'li',
				properties: {},
				children: [{ type: 'text', value: item }],
			})),
		};
		itemDiv.children.push(subItemsUl);
	}

	return itemDiv;
}

const createChecklistProcessor = (options: ProcessOptions) =>
	rehype()
		.data('settings', { fragment: true })
		.use(function checklist() {
			return (tree: Root, vfile: VFile) => {
				const rootElements = tree.children.filter(
					(item): item is Element => item.type === 'element'
				);
				const [rootElement] = rootElements;

				// Validation
				if (!rootElement) {
					throw new ChecklistError(
						'The `<Checklist>` component expects its content to be a single unordered list (`<ul>`) but found no child elements.'
					);
				} else if (rootElements.length > 1) {
					throw new ChecklistError(
						'The `<Checklist>` component expects its content to be a single unordered list (`<ul>`) but found multiple child elements: ' +
						rootElements.map((element: Element) => `\`<${element.tagName}>\``).join(', ') +
						'.',
						vfile.value.toString()
					);
				} else if (rootElement.tagName !== 'ul') {
					throw new ChecklistError(
						'The `<Checklist>` component expects its content to be a single unordered list (`<ul>`) but found the following element: ' +
						`\`<${rootElement.tagName}>\`.`,
						vfile.value.toString()
					);
				}

				// Ensure role="list" is set for accessibility
				rootElement.properties.role = 'list';

				// Add the required CSS class name
				if (!Array.isArray(rootElement.properties.className)) {
					rootElement.properties.className = ['sl-checklist'];
				} else {
					rootElement.properties.className.push('sl-checklist');
				}

				// Transform each list item
				const listItems = rootElement.children.filter(
					(child): child is Element => child.type === 'element' && child.tagName === 'li'
				);

				const transformedItems: Element[] = [];

				// Add title as first element if provided
				if (options.title) {
					const titleElement: Element = {
						type: 'element',
						tagName: 'h3',
						properties: { className: ['sl-checklist-title'] },
						children: [{ type: 'text', value: options.title }],
					};
					transformedItems.push(titleElement);
				}

				listItems.forEach((item, index) => {
					const transformed = transformListItem(item, options, index);
					transformedItems.push(transformed);
				});

				// Replace children with transformed items
				rootElement.children = transformedItems;
			};
		});

/**
 * Process checklist children: validates the HTML and transforms it into the checklist structure
 * @param html Inner HTML passed to the `<Checklist>` component
 * @param options Processing options (interactive mode, status colors)
 */
export const processChecklist = (html: string | undefined, options: ProcessOptions = {}) => {
	const processor = createChecklistProcessor(options);
	const file = processor.processSync({ value: html });
	return { html: file.toString() };
};

class ChecklistError extends AstroError {
	constructor(message: string, html?: string) {
		let hint =
			'To learn more about the `<Checklist>` component, see the documentation or follow the pattern used by Starlight components.';
		if (html) {
			hint += '\n\nFull HTML passed to `<Checklist>`:\n' + prettyPrintHtml(html);
		}
		super(message, hint);
	}
}
