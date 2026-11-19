import { config } from '@websites/eslint-config';

export default config({
  root: import.meta.dirname,
  svelte: true,
  // paraglide.js project files, written by its tooling
  ignores: ['project.inlang/**'],
});
