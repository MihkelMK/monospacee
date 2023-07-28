<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import type { ImageSrc } from '$lib/types';

	export let src: ImageSrc[];
	export let alt = '';
	export let loading: 'lazy' | 'eager' | undefined = 'lazy';
</script>

<Img class="better-blur"  {src} {alt} {loading} />
