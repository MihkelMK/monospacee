<script lang="ts">
	import type { ImageInfo } from '$lib/types';
	import Image from './Image.svelte';

	interface Props {
		images: ImageInfo[];
	}

	let { images }: Props = $props();
</script>

{#if images}
	<ul class="gallery">
		{#each images as { src, alt, title, link }, i (src + String(i))}
			<li class={title || link ? 'withText' : ''}>
				<Image {src} {alt} loading={i < 3 ? 'eager' : 'lazy'} />
				{#if title}
					<p>{title}</p>
				{/if}
				{#if link}
					<a href={link.href} target="_blank" referrerpolicy="no-referrer"
						>{link.text ?? 'source'}</a
					>
				{/if}
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
			position: relative;

			&.withText:before {
				content: '';
				position: absolute;
				bottom: 0;
				width: 100%;
				height: 2.5em;
				backdrop-filter: blur(5px) brightness(0.6) contrast(0.9) saturate(0.9) opacity(0.8);
			}

			& a,
			p {
				position: absolute;
				bottom: 0.6rem;
				--color: #e2e2e2;
				font-size: 0.85em;
				mix-blend-mode: color-dodge;
			}

			& p {
				left: 1rem;
				margin-bottom: 0;
			}

			& a {
				right: 1rem;
			}
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
