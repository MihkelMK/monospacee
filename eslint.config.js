import { config } from '@websites/eslint-config';
import { loadConfig } from '@sveltejs/load-config';

const svelteConfig = (await loadConfig('./', { traverse: false }))?.config;

export default config({
  root: import.meta.dirname,
  svelte: svelteConfig,
  // paraglide.js project files, written by its tooling
  ignores: ['project.inlang/**'],
});
