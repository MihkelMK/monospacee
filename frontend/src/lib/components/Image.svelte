<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import type { ImageSrcObject } from '$lib/types';

	export let src: ImageSrcObject;
	export let alt = '';
	export let circle = false;
	export let loading: 'lazy' | 'eager' | undefined = 'lazy';
</script>

<Img class="better-blur {circle ? 'circle' : ''}" {src} {alt} {loading} />

