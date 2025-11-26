// Squelch warnings of image imports from your assets dir
declare module '$lib/assets/*' {
	const meta: object[];
	export default meta;
}
