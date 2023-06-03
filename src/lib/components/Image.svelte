<script lang="ts">
	export let src: any;
	export let alt = '';
	export let loading = 'lazy';

	import { FxParallax as Img } from '@zerodevx/svelte-img';
</script>

<Img class="better-blur" factor={0.7} {src} {alt} {loading} />

<style>
	:global(img.better-blur)::after {
		content: '';
		position: absolute;
		inset: 0;
		backdrop-filter: blur(20px);
		pointer-events: none;
	}
</style>
