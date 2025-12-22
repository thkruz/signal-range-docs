export interface ChecklistItem {
	/** Display label for the checklist item */
	label: string;

	/** Optional status value (e.g., "ON", "LOCKED") */
	status?: string;

	/** Color variant for the status */
	statusColor?: 'success' | 'warning' | 'error' | 'info';

	/** Nested bullet points under this item */
	subItems?: string[];

	/** Unique identifier for this item */
	id: string;
}

export interface ChecklistProps {
	/** Enable interactive mode with checkboxes */
	interactive?: boolean;

	/** Storage key for persisting checkbox state */
	storageKey?: string;

	/** Map status values to color variants */
	statusColors?: Record<string, 'success' | 'warning' | 'error' | 'info'>;

	/** CSS class name to add to the checklist */
	class?: string;

	/** Optional title displayed at the top center of the checklist */
	title?: string;
}

export interface ProcessedChecklist {
	/** Transformed HTML string */
	html: string;

	/** Parsed checklist items */
	items: ChecklistItem[];
}
