<script lang="ts">
	import * as config from '$lib/config';
	import { formatDate, timeStringFromSeconds } from '$lib/utils';
	import type { PageData, PostType } from './$types';
	import { selectedRecording, cueJump, streamingData } from '../store';

	export let data: PageData;

	$: progress = $streamingData[$selectedRecording].progress;

	const loadToPlayer = (slug: string) => {
		selectedRecording.set(slug);
	};

	const getClass = (type: PostType) => {
		if (type === 'event') return 'secondary';
		if (type === 'stream') return 'primary';
		return 'contrast';
	};

	const scrubToSong = (start: number, audioUrl: string) => {
		const cleanSlug = audioUrl.split('.').at(0);
		if (!cleanSlug) return;

		if (cleanSlug != $selectedRecording) selectedRecording.set(cleanSlug);
		cueJump.set(start);
	};
</script>

<svelte:head>
	<title>{config.title + ' | ' + data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />

	<meta
		name="og:image"
		content={encodeURI(
			`${config.url}/api/og?date=${data.meta.date}&title=${data.meta.title}&type=${data.meta.type}`
		)}
	/>
</svelte:head>

<article class="post {getClass(data.meta.type)}">
	<header>
		<hgroup>
			<h1 class="glow-sm">{data.meta.title}</h1>
			<h4>{formatDate(data.meta.date)} [{data.meta.type.slice(0, 1).toUpperCase()}]</h4>
		</hgroup>

		<nav class="tags">
			<ul>
				{#each data.meta.tags as tag}
					<li>
						<small>&num;{tag}</small>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main>
		<h3 id="sisukord">
			Sisukord
			{#if data.meta.duration}
				<button
					disabled={$selectedRecording === data.meta.date}
					data-tooltip="Load to player"
					on:click={() => loadToPlayer(data.meta.date)}
				>
					<iconify-icon inline icon="pixelarticons:playlist" />
				</button>
			{/if}
			{#if data.meta.youtube}
				<a
					role="button"
					class="contrast"
					href={`https://www.youtube.com/live/${data.meta.youtube}`}
					data-tooltip="Watch on youtube"
				>
					<iconify-icon inline icon="mdi-youtube" />
				</a>
			{/if}
		</h3>

		<svelte:component this={data.content} />
	</main>

	<footer>
		<h3 id="tracklist">Tracklist</h3>
		<nav>
			<ul>
				{#each data.cue.songs as song}
					<li class={progress >= song.start ? 'played' : ''}>
						<button on:click={() => scrubToSong(song.start, data.cue.slug)}>
							<span>[{timeStringFromSeconds(song.start)}]</span>
							<strong>{song.title}</strong>
							<small>/ {song.artist}</small>
						</button>
					</li>
				{/each}
			</ul>
		</nav>
	</footer>
</article>

<style lang="scss">
	.headerButtons {
		place-self: center;
		grid-row: span 2;
	}
	hgroup {
		margin-bottom: calc(var(--typography-spacing-vertical) * 0.5);

		h1 {
			font-size: 2.5rem;
		}
		h4 {
			font-size: 1.1rem;
		}
	}

	header {
		grid-column: span 2;
		margin-bottom: calc(var(--block-spacing-vertical) * 0.75);
	}

	article {
		min-height: 90dvh;

		padding-bottom: 0;

		footer {
			margin-bottom: var(--block-spacing-vertical);
			ul {
				flex-direction: column;
				align-items: start;
				li {
					padding: calc(var(--nav-element-spacing-vertical) * 0.5)
						calc(var(--nav-element-spacing-horizontal) * 0.5);
					& button {
						padding: calc(var(--nav-link-spacing-vertical) * 0.125)
							calc(var(--nav-element-spacing-horizontal) * 0.125);
						border-radius: calc(var(--border-radius) * 1.5);
						text-align: start;
						width: fit-content;
						--background-color: transparent;
						--border-color: transparent;
						--color: var(--accent-color);

						&:hover {
							--color: var(--accent-hover);
						}
					}

					&.played {
						& button {
							--color: color-mix(in srgb, var(--accent-color) 60%, rgba(0, 0, 0, 0.3));

							&:hover {
								--color: var(--accent-hover);
							}
						}
					}
				}
			}
		}
	}

	main {
		& :global(nav) {
			margin-left: calc(var(--spacing) * 0.5);
			min-width: 100%;
		}

		@media screen and (min-width: 992px) {
			display: flex;
			flex-flow: row wrap;
			gap: var(--grid-spacing-vertical);
		}

		#sisukord {
			color: var(--accent-color);
			margin-bottom: calc(var(--typography-spacing-vertical) * 0.25);

			& button,
			a {
				display: inline-block;
				width: fit-content;
				vertical-align: middle;
			}
		}

		:global(section) {
			flex: 1 1 25rem;
			height: fit-content;
		}

		:global(section.hasGallery) {
			@media screen and (min-width: 992px) {
				display: grid;
				grid-template-columns: 1fr 1fr;
				min-width: 100%;
			}
		}

		:global(section.hasGallery *:first-child) {
			grid-column: span 2;
		}

		:global(section.hasGallery .gallery) {
			grid-column-start: 2;
			grid-row: 2/100;
		}

		:global(section.hasGallery *:not(ul)) {
			grid-column-start: 1;
		}

		:global(section h1::before),
		:global(section h2::before),
		:global(section h3::before),
		:global(section h4::before),
		:global(section h5::before),
		:global(section h6::before) {
			content: '#';
			font-family: var(--font-base);
			font-size: max(0.65em, 1.125rem);
			margin-inline-end: min(0.5em, 0.5rem);
			color: var(--muted-color);
		}

		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			scroll-margin-top: min(16rem, 25dvh);
			position: relative;

			@media screen and (min-width: 992px) {
				grid-column-end: 3;
			}
		}

		:global(h2) {
			border-bottom: 0.15rem groove color-mix(in srgb, var(--muted-color) 40%, transparent);
		}
	}

	:global(main > section),
	:global(#sisukord),
	:global(nav.toc) {
		padding-inline: var(--nav-element-spacing-horizontal);
	}

	@keyframes sweep {
		0% {
			opacity: 0;
			translate: -10px;
		}
		100% {
			opacity: 1;
			translate: 0px;
		}
	}
</style>
