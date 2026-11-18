import { config } from '@websites/eslint-config';
import svelteConfig from './svelte.config.js';

export default config({
  root: import.meta.dirname,
  svelte: svelteConfig,
  // paraglide.js project files, written by its tooling
  ignores: ['project.inlang/**'],
});
