<script lang="ts">
	import Img from '@zerodevx/svelte-img';
	import type { ImageSrc } from '$lib/types';

	interface Props {
		src: ImageSrc[];
		alt?: string;
		loading?: 'lazy' | 'eager' | undefined;
	}

	let { src, alt = '', loading = 'lazy' }: Props = $props();
</script>

<Img class="better-blur" {src} {alt} {loading} />
