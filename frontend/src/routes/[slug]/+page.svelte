<script lang="ts">
	import * as config from '$lib/config';
	import { formatDate, timeStringFromSeconds } from '$lib/utils';
	import type { PostEvent } from '$lib/types';
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';
	import { selectedRecording, cueJump, streamingData } from '$lib/store';

	export let data: PageData;

	$: progress = $streamingData[$selectedRecording].progress;

	const loadToPlayer = (slug: string) => {
		selectedRecording.set(slug);
	};

	const getClass = (type: PostEvent) => {
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

<MetaTags
	title={data.meta.title}
	titleTemplate={'%s | ' + config.title}
	description={data.meta.description}
	canonical={config.url + '/' + data.meta.date}
	openGraph={{
		url: config.url + '/' + data.meta.date,
		title: data.meta.title + ' | ' + config.title,
		description: data.meta.description,
		type: 'article',
		locale: 'et_EE',
		audio: data.meta.recording
			? [
					{
						url: config.url + '/recordings/' + data.meta.date + '.mp3',
						secureUrl: config.url + '/recordings/' + data.meta.date + '.mp3',
						type: 'mpeg'
					}
				]
			: [],
		images: [
			{
				url: encodeURI(
					`${config.ogUrl}/?date=${data.meta.date}&title=${data.meta.title}&type=${data.meta.type}`
				),
				secureUrl: encodeURI(
					`${config.ogUrl}/?date=${data.meta.date}&title=${data.meta.title}&type=${data.meta.type}`
				),
				width: 1200,
				height: 630,
				alt:
					'A graphic design introducing the ' +
					data.meta.type +
					' called ' +
					data.meta.title +
					' by the DJ duo, monospacee.',
				type: 'image/png'
			}
		],
		article: {
			publishedTime: data.meta.date + 'T00:00:00+02:00',
			authors: ['DJ RX', 'DJ Mimm'],
			tags: data.meta.tags
		},
		siteName: config.site_name
	}}
	twitter={{
		cardType: 'summary',
		title: data.meta.title,
		description: data.meta.description,
		image: encodeURI(
			`${config.ogUrl}/?date=${data.meta.date}&title=${data.meta.title}&type=${data.meta.type}`
		),
		imageAlt:
			'A graphic design introducing the ' +
			data.meta.type +
			' called ' +
			data.meta.title +
			' by the DJ duo, monospacee.'
	}}
/>

<article class="post {getClass(data.meta.type)}">
	<header>
		<hgroup>
			<h1 class="glow-sm">{data.meta.title}</h1>
			<h2>{formatDate(data.meta.date)} [{data.meta.type.slice(0, 1).toUpperCase()}]</h2>
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
			{#if data.meta.recording}
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

	{#if data.cue}
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
	{/if}
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
							@media only screen and (prefers-color-scheme: light) {
								--color: color-mix(in srgb, var(--accent-color) 50%, rgba(255, 255, 255, 0.3));
							}
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
