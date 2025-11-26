<script lang="ts">
	import { getAudioStore } from '$lib/store.svelte';
	import type { Cue, Song } from '$lib/types';
	import { onMount } from 'svelte';

	interface Props {
		scrub: (start: number, audioURL: string) => void;
		cue: Cue;
		recording: string;
		currentSongIndex: number | undefined;
		savedProgress: number | null;
	}

	let { cue, recording, currentSongIndex, savedProgress, scrub }: Props = $props();

	const audioStore = getAudioStore();

	let list_element: HTMLUListElement | undefined = $state();
	let is_tracklist_playing: boolean = $derived(audioStore.selectedRecording === recording);

	let currentTime = $derived(is_tracklist_playing ? audioStore.currentTime : savedProgress);
	let closestIndex = $derived(
		is_tracklist_playing ? audioStore.currentSongIndex : currentSongIndex
	);
	let closest = $derived(closestIndex ? cue.songs.at(closestIndex) : undefined);
	let last_track: Song | undefined = $state();

	function scroll_on_change(closest: Song | undefined, last_track: Song | undefined) {
		if (!closest || closest === last_track || !list_element) return;

		last_track = closest;
		scrollToSong(closest);
	}

	function scrollToSong(song: Song | undefined) {
		if (!song || !list_element) return;

		const current_list_element = Array.from(list_element.children)
			.filter((list_element) => list_element.id === String(song.start))
			.at(0);

		if (current_list_element) {
			current_list_element.scrollIntoView();
		}
	}

	$effect(() => {
		if (is_tracklist_playing) {
			scroll_on_change(closest, last_track);
		}
	});

	onMount(() => {
		scrollToSong(closest);
	});
</script>

<nav>
	<ul bind:this={list_element}>
		{#each cue.songs as song, i (song.title + String(song.start))}
			<li id={String(song.start)}>
				<button
					class={!currentTime
						? ''
						: closest?.start === song.start
							? 'current glow-sm'
							: currentTime >= song.start
								? 'played'
								: ''}
					onclick={() => scrub(song.start, cue.slug)}>
					<p class="track_info_number">
						{i + 1}:
					</p>
					<p class="track_info_title">
						<strong>{song.title}</strong>
					</p>
					<p>{song.artist}</p>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	ul {
		--tracklist-height: 20rem;
		--mask: linear-gradient(
				to bottom,
				rgba(0, 0, 0, 0) 0,
				rgba(0, 0, 0, 1) 15%,
				rgba(0, 0, 0, 1) 50%,
				rgba(0, 0, 0, 1) 85%,
				rgba(0, 0, 0, 0) 100%
			)
			100% 100% / 100% 100% repeat-x;

		-webkit-mask: var(--mask);
		mask: var(--mask);

		flex-direction: column;
		height: var(--tracklist-height);
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		width: 100%;
		padding-block: 2rem 1rem;

		li {
			scroll-margin-top: calc(
				var(--tracklist-height) / 2 - var(--nav-element-spacing-vertical) * 2
			);
			width: 100%;
			text-align: center;

			& button {
				width: 100%;
				max-width: 40ch;

				--background-color: transparent;
				--border-color: transparent;

				& p {
					margin-bottom: 0;
					--color: var(--contrast);
					font-size: 1em;

					&.track_info_title,
					&.track_info_number {
						--color: var(--accent-color);
						font-size: 1.1em;
					}

					&.track_info_number {
						display: none;
					}
				}

				&:hover p {
					--color: var(--dropdown-color);
					&:first-of-type {
						--color: var(--accent-hover);
					}
				}

				&.current {
					& p {
						margin-bottom: 0;
						--color: var(--contrast-hover);
						&.track_info_title,
						&.track_info_number {
							--color: var(--accent-color);
						}
					}

					&:hover p {
						--color: var(--contrast);
						&:first-of-type {
							--color: var(--accent-hover);
						}
					}
				}

				&.played {
					& p {
						--color: var(--muted-color);
						&.track_info_title,
						&.track_info_number {
							--color: color-mix(in srgb, var(--accent-color) 60%, rgba(0, 0, 0, 0.3));
							@media only screen and (prefers-color-scheme: light) {
								--color: color-mix(in srgb, var(--accent-color) 50%, rgba(255, 255, 255, 0.3));
							}
						}
					}
					&:hover p {
						--color: var(--contrast);
						&.track_info_title,
						&.track_info_number {
							--color: var(--accent-hover);
						}
					}
				}
			}
		}

		@media screen and (min-width: 768px) {
			--mask: linear-gradient(
					to bottom,
					rgba(0, 0, 0, 0) 0,
					rgba(0, 0, 0, 1) 10%,
					rgba(0, 0, 0, 1) 50%,
					rgba(0, 0, 0, 1) 90%,
					rgba(0, 0, 0, 0) 100%
				)
				100% 100% / 100% 100% repeat-x;
			align-items: start;

			& li {
				text-align: left;

				& button {
					max-width: unset;
					display: grid;
					gap: 0 0.5rem;
					text-align: left;
					grid-template-columns: auto 1fr;

					& p {
						grid-column: 2;
						width: fit-content;
						font-size: 1em;

						&.track_info_number {
							grid-column: 1;
							display: initial;
						}
					}
				}
			}
		}
	}
</style>
