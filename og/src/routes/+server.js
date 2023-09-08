import robotoMono500 from '$lib/Roboto Mono 500.ttf';
import robotoMono700 from '$lib/Roboto Mono 700.ttf';
import { componentToImageResponse } from '@ethercorps/sveltekit-og';
import OG from './OG.svelte';

const fontMemo = {};

async function getFont(path) {
	if (fontMemo[path]) {
		return fontMemo[path];
	}

	const result = await fetch(path).then((r) => r.arrayBuffer());
	fontMemo[path] = result;
	return result;
}

export const GET = async ({ url, setHeaders }) => {
	const title = url.searchParams.get('title') ?? '';
	const date = url.searchParams.get('date') ?? '';
	const type = url.searchParams.get('type') ?? '';

	const fontData = await getFont(`${url.origin}${robotoMono500}`);
	const fontDataBold = await getFont(`${url.origin}${robotoMono700}`);

	setHeaders({ 'cache-control': 'public, immutable, no-transform, max-age=86400' });

	return componentToImageResponse(
		OG,
		{ title: title, date: date, postType: type },
		{
			height: 630,
			width: 1200,
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
};
