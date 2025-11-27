import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import { mdsvex } from 'mdsvex';
import rehypeToc from '@jsdevtools/rehype-toc';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import remarkCapitalizeHeadings from 'remark-capitalize-headings';
import rehypeSlug from 'rehype-slug';
import rehypeShiftHeading from 'rehype-shift-heading';
import rehypePresetMinify from 'rehype-preset-minify';
import sectionize from 'remark-sectionize';
import rehypeRewrite from 'rehype-rewrite';

const addTracklist = (tocNav) => {
	const trackListLink = structuredClone(tocNav.children[0].children[0]);
	trackListLink.children = trackListLink.children.filter((child) => child.tagName === 'a');
	trackListLink.data = {};
	trackListLink.properties.className = 'toc-item toc-item-details';
	trackListLink.children[0].properties.className = 'toc-link toc-link-details';
	trackListLink.children[0].properties.href = '#tracklist';
	trackListLink.children[0].children[0].value = 'Tracklist';

	tocNav.children[0].children = [...tocNav.children[0].children, trackListLink];
	return tocNav;
};

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
	extensions: ['.md'],
	rehypePlugins: [
		rehypeSlug,
		[rehypeShiftHeading, { shift: 1 }],
		[
			rehypeRewrite,
			{
				rewrite: (node) => {
					if (node.type === 'element') {
						if (
							node.tagName === 'section' &&
							node.children.some((child) => child.type === 'raw' && child.value.includes('Gallery'))
						) {
							node.properties.className = 'hasGallery';
						} else if (node.tagName === 'a') {
							node.properties.target = '_blank';
							node.properties.rel = ['nofollow', 'noopener'];
						}
					}
				}
			}
		],
		[rehypeToc, { customizeTOC: addTracklist }],
		rehypePresetMinify
	],
	remarkPlugins: [remarkSqueezeParagraphs, remarkCapitalizeHeadings, sectionize]
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex(mdsvexOptions),
		vitePreprocess({
			scss: {
				prependData: '@import "src/variables.scss";'
			}
		})
	],

	kit: {
		adapter: adapter()
	}
};

export default config;
