import { read } from '$app/server';
import { render } from 'svelte/server';
import satori from 'satori';
import { html as toReactNode } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';

import robotoMono500 from '$lib/assets/fonts/Roboto Mono 500.ttf';
import robotoMono700 from '$lib/assets/fonts/Roboto Mono 700.ttf';
import OgBig from './OGBig.svelte';
import Og from './OG.svelte';

const fontData = read(robotoMono500 as unknown as string).arrayBuffer();
const fontDataBold = read(robotoMono700 as unknown as string).arrayBuffer();

export const GET = async ({ url, params, setHeaders }) => {
	const size = params.size || 'small';
	const type = url.searchParams.get('type') || '';

	const template = size === 'big' ? OgBig : Og;
	const width = size === 'big' ? 3000 : 1200;
	const height = size === 'big' ? 3000 : 630;

	const result = render(template, { props: { postType: type } });
	const element = toReactNode(result.head + result.body);

	const svg = await satori(element, {
		height,
		width,
		fonts: [
			{
				name: 'Roboto Mono',
				data: await fontData,
				weight: 500
			},
			{
				name: 'Roboto Mono',
				data: await fontDataBold,
				weight: 700
			}
		]
	});

	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: width
		}
	});

	const image = resvg.render();

	setHeaders({ 'cache-control': 'public, immutable, no-transform, max-age=86400' });

	return new Response(image.asPng(), {
		headers: {
			'content-type': 'image/png'
		}
	});
};
