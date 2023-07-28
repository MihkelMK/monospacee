import robotoMono500 from '@fontsource/roboto-mono/files/roboto-mono-latin-500-normal.woff';
import robotoMono700 from '@fontsource/roboto-mono/files/roboto-mono-latin-700-normal.woff';
import { componentToImageResponse } from '@ethercorps/sveltekit-og';
import type { RequestHandler } from '@sveltejs/kit';
import OG from './OG.svelte';

const fontMemo: Record<string, ArrayBuffer> = {};

async function getFont(path: string) {
	if (fontMemo[path]) {
		return fontMemo[path];
	}

	const result = await fetch(path).then((r) => r.arrayBuffer());
	fontMemo[path] = result;
	return result;
}

export const GET = (async ({ url }) => {
	const title = url.searchParams.get('title') ?? '';
	const date = url.searchParams.get('date') ?? '';
	const type = url.searchParams.get('type') ?? '';
	const fontData = await getFont(`${url.origin}${robotoMono500}`);
	const fontDataBold = await getFont(`${url.origin}${robotoMono700}`);

	return componentToImageResponse(
		OG,
		{ title: title, date: date, postType: type },
		{
			height: 3000,
			width: 3000,
			fonts: [
				{
					name: 'Roboto Mono',
					data: fontData,
					weight: 500
				},
				{
					name: 'Roboto Mono',
					data: fontDataBold,
					weight: 700
				}
			]
		}
	);
}) satisfies RequestHandler;
