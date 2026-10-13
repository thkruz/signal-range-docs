// Worker-runtime stand-in for the `satteri` package.
//
// Starlight 0.42's on-demand <Steps>, <Tabs> and <FileTree> components import
// `htmlToHast` from `satteri` at request time. In workerd, `satteri` resolves
// to its WASM build, which cannot run on Cloudflare Workers (it compiles WASM
// from fetched bytes, needs shared memory and spawns Web Workers), and the
// build fails on the missing `@bruits/satteri-wasm32-wasi` package.
//
// astro.config.mjs aliases `satteri` to this module only for server-side Vite
// environments (the Worker bundle). Build-time Markdown/MDX compilation runs in
// Node and still uses the native `satteri` binding.
//
// `hast-util-from-html` takes the same `fragment` / `space` options and returns
// the same hast `Root` shape, which is what Starlight's processors consume.
import { fromHtml } from 'hast-util-from-html';
import type { Root } from 'hast';

export interface HtmlToHastOptions {
	fragment?: boolean;
	space?: 'html' | 'svg';
}

export function htmlToHast(html: string, options: HtmlToHastOptions = {}): Root {
	return fromHtml(html, { fragment: options.fragment, space: options.space });
}
