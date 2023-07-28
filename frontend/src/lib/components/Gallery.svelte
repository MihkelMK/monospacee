<script lang="ts">
	import type { ImageInfo } from '$lib/types';
	import Image from './Image.svelte';

	export let images: ImageInfo[];
</script>

{#if images}
	<ul class="gallery">
		{#each images.slice(0, 3) as { src, alt }}
			<li>
				<Image {src} {alt} loading="eager" />
			</li>
		{/each}
		{#each images.slice(3) as { src, alt }}
			<li>
				<Image {src} {alt} loading="lazy" />
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	ul {
		padding: 0;
		margin: 0;

		display: flex;
    align-self: center;
		flex-wrap: wrap;
		gap: var(--grid-spacing-horizontal);

		margin-bottom: var(--typography-spacing-vertical);

		@media screen and (min-width: 992px) {
			margin-bottom: 0;
		}

		& li {
			margin: 0;
			list-style: none;
			flex: 1 1 20rem;
			min-height: 25vh;
			min-width: 100%;
			max-height: calc(40vh - 0.5rem);
		}
		& :global(img) {
			border-radius: var(--border-radius);
			object-fit: cover;
			width: 100%;
			height: 100%;
			box-shadow: var(--card-box-shadow);

			@media screen and (min-width: 992px) {
				border-radius: calc(var(--border-radius) * 2);
			}
		}
	}
</style>
