<script lang="ts">
	import * as config from '$lib/config';
	import { formatDate, recordingPathFromDate } from '$lib/utils';
	import Tracklist from '$lib/components/Tracklist.svelte';
	import type { PostType } from '$lib/types';
	import type { PageData } from './$types';
	import { MetaTags } from 'svelte-meta-tags';
	import { cueJump, getAudioStore } from '$lib/store.svelte';
	import { m } from '$lib/paraglide/messages';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const audioStore = getAudioStore();

	const loadToPlayer = async (date: string) => {
		const newPath = recordingPathFromDate(date);
		if (audioStore.selectedRecording !== newPath) {
			await audioStore.setRecording(newPath);
		}
	};

	const getClass = (type: PostType) => {
		if (type === 'event') return 'secondary';
		if (type === 'stream') return 'primary';
		return 'contrast';
	};

	const scrubToSong = async (start: number, audioURL: string) => {
		const date = audioURL.split('.').at(0);
		if (!date) return;

		await loadToPlayer(date);

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
	}} />

<article class="post {getClass(data.meta.type)}">
	<header>
		<hgroup>
			<h1 class="glow-sm">{data.meta.title}</h1>
			<h2>{formatDate(data.meta.date)} [{data.meta.type.slice(0, 1).toUpperCase()}]</h2>
		</hgroup>

		<nav class="tags">
			<ul>
				{#each data.meta.tags as tag (data.meta.title + tag)}
					<li>
						<small>&num;{tag}</small>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<main class={data.meta.recording ? 'recorded' : ''}>
		<h3 id="toc">
			{m['toc']()}
			{#if data.meta.recording}
				<button
					disabled={audioStore.selectedRecording === recordingPathFromDate(data.meta.date)}
					data-tooltip="Load to player"
					aria-labelledby="Load to player"
					onclick={() => loadToPlayer(data.meta.date)}>
					<iconify-icon inline icon="pixelarticons:playlist"></iconify-icon>
				</button>
			{/if}
			{#if data.meta.youtube}
				<a
					role="button"
					href={`https://www.youtube.com/live/${data.meta.youtube}`}
					data-tooltip="Watch on youtube"
					target="_blank"
					aria-labelledby="Watch on Youtube">
					<iconify-icon inline icon="mdi-youtube"></iconify-icon>
				</a>
			{/if}
		</h3>

		<data.content />
	</main>

	{#if data.streamed?.postCue}
		<footer>
			{#await data.streamed.postCue}
				<h3 id="tracklist">
					<span>Tracklist</span>
					<small>[0/0]</small>
				</h3>
			{:then cue}
				{#if cue}
					{@const recording = '/recordings/' + cue.slug}
					{@const savedProgress = audioStore.loadProgress(recording)}
					{@const currentSongIndex = audioStore.getCurrentSongIndex(savedProgress, cue)}
					<h3 id="tracklist">
						<span>Tracklist</span>
						{#if audioStore.selectedRecording === recording && typeof audioStore.currentSongIndex === 'number'}
							<small>
								[{audioStore.currentSongIndex + 1}/{cue.songs.length}]
							</small>
						{:else if typeof currentSongIndex === 'number'}
							<small>
								[{currentSongIndex + 1}/{cue.songs.length}]
							</small>
						{:else}
							<small>[0/{cue.songs.length}]</small>
						{/if}
					</h3>
					<Tracklist {recording} {currentSongIndex} {savedProgress} {cue} scrub={scrubToSong} />
				{/if}
			{/await}
		</footer>
	{/if}
</article>

<style lang="scss">
	footer h3 {
		display: flex;
		justify-content: space-between;
		align-items: center;

		small {
			color: var(--muted-color);
		}
	}

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

		:global(nav.toc) {
			margin-bottom: 0;
		}

		#toc {
			color: var(--accent-color);
			margin-top: 0;
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
			margin-top: var(--typography-spacing-vertical);
			margin-bottom: calc(var(--typography-spacing-vertical) / 2);

			scroll-margin-top: min(16rem, 25dvh);
			position: relative;

			@media screen and (min-width: 992px) {
				grid-column-end: 3;
			}
		}

		:global(h2) {
			border-bottom: 0.15rem groove color-mix(in srgb, var(--muted-color) 40%, transparent);
		}

		:global(blockquote) {
			margin-top: 0;
		}

		:global(blockquote > p) {
			margin-bottom: 0;
		}
	}

	:global(main > section),
	:global(#toc),
	:global(nav.toc) {
		padding-inline: var(--nav-element-spacing-horizontal);
	}

	:global(main > section) {
		margin-bottom: 0;
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
