import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

import { escapeSvelte, mdsvex } from 'mdsvex';
import shiki from 'shiki';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkToc from 'remark-toc';
import remarkNormalizeHeadings from 'remark-normalize-headings';
import remarkStripBadges from 'remark-strip-badges';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import rehypeSlug from 'rehype-slug';
import rehypeShiftHeading from 'rehype-shift-heading';

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	layout: {
		_: './src/mdsvex.svelte'
	},
	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await shiki.getHighlighter({ theme: 'one-dark-pro' });

			const html = escapeSvelte(highlighter.codeToHtml(code, { lang }));

			return `{@html \`${html}\`}`;
		}
	},
	remarkPlugins: [
		[remarkToc, { tight: true, heading: 'Sisukord' }],
		remarkUnwrapImages,
		remarkNormalizeHeadings,
		remarkStripBadges,
		remarkSqueezeParagraphs
	],
	rehypePlugins: [rehypeSlug, [rehypeShiftHeading, { shift: -1 }]]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		preprocess({
			scss: {
				prependData: '@import "src/variables.scss";'
			}
		}),
		mdsvex(mdsvexOptions)
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
