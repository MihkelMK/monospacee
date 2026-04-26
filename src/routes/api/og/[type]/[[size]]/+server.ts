import { ImageResponse } from '@ethercorps/sveltekit-og';
import { GoogleFont, resolveFonts } from '@ethercorps/sveltekit-og/fonts';

import Og from './OG.svelte';
import OgSquare from './OGSquare.svelte';

const robotomonoRegular = new GoogleFont('Roboto Mono', {
  weight: 500,
});

const robotomonoBold = new GoogleFont('Roboto Mono', {
  weight: 700,
});

export const GET = async ({ params }) => {
  const size = params.size || 'landscape';
  const type = params.type || '';

  const template = size === 'big' || size === 'small' ? OgSquare : Og;
  const width = size === 'big' ? 3000 : size === 'small' ? 512 : 1200;
  const height = size === 'big' ? 3000 : size === 'small' ? 512 : 630;

  const resolvedFontOptions = await resolveFonts([robotomonoRegular, robotomonoBold]);

  return new ImageResponse(
    template,
    {
      height: height,
      width: width,
      fonts: resolvedFontOptions,
      headers: {
        'content-type': 'image/png',
        'cache-control': 'public, immutable, no-transform, max-age=86400',
      },
    },
    { postType: type }
  );
};
