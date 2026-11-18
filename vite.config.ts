import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, type MdsvexOptions } from 'mdsvex';
import rehypeToc from '@jsdevtools/rehype-toc';
import rehypePresetMinify from 'rehype-preset-minify';
import rehypeRewrite from 'rehype-rewrite';
import rehypeShiftHeading from 'rehype-shift-heading';
import rehypeSlug from 'rehype-slug';
import remarkCapitalizeHeadings from 'remark-capitalize-headings';
import sectionize from 'remark-sectionize';
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs';
import { sveltekitOG } from '@ethercorps/sveltekit-og/plugin';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from '@zerodevx/svelte-img/vite';
import { defineConfig } from 'vite';

// shortcut: loose hast typing, tighten if @types/hast is added
// eslint-disable-next-line @typescript-eslint/no-explicit-any, sonarjs/redundant-type-aliases
type HastNode = any;

const addTracklist = (tocNav: HastNode) => {
  const trackListLink = structuredClone(tocNav.children[0].children[0]);

  trackListLink.children = trackListLink.children.filter((child: HastNode) => child.tagName === 'a');
  trackListLink.data = {};
  trackListLink.properties.className = 'toc-item toc-item-details';
  trackListLink.children[0].properties.className = 'toc-link toc-link-details';
  trackListLink.children[0].properties.href = '#tracklist';
  trackListLink.children[0].children[0].value = 'Tracklist';
  tocNav.children[0].children = [...tocNav.children[0].children, trackListLink];

  return tocNav;
};

const mdsvexOptions: MdsvexOptions = {
  extensions: ['.md'],
  rehypePlugins: [
    rehypeSlug,
    [rehypeShiftHeading, { shift: 1 }],
    [
      rehypeRewrite,
      {
        rewrite: (node: HastNode) => {
          if (node.type === 'element') {
            if (
              node.tagName === 'section' &&
              node.children.some((child: HastNode) => child.type === 'raw' && child.value.includes('Gallery'))
            ) {
              node.properties.className = 'hasGallery';
            } else if (node.tagName === 'a') {
              node.properties.target = '_blank';
              node.properties.rel = ['nofollow', 'noopener'];
            }
          }
        },
      },
    ],
    [rehypeToc, { customizeTOC: addTracklist }],
    rehypePresetMinify,
  ] as unknown as MdsvexOptions['rehypePlugins'],
  remarkPlugins: [remarkSqueezeParagraphs, remarkCapitalizeHeadings, sectionize] as unknown as MdsvexOptions['remarkPlugins'],
};

export default defineConfig({
  plugins: [
    sveltekit({
      extensions: ['.svelte', '.md'],
      preprocess: [mdsvex(mdsvexOptions), vitePreprocess()],
      adapter: adapter(),
    }),
    sveltekitOG({ esmImport: false }),
    imagetools(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'cookie'],
      emitTsDeclarations: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: '@use "/src/variables.scss" as *;',
      },
    },
  },
});
