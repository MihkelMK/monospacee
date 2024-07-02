<script lang="ts">
	import { selectedRecording, streamingData } from '$lib/store';
	import type { Cue, Song } from '$lib/types';
	import { createEventDispatcher, onMount } from 'svelte';

	export let cue: Cue;

	let dispatch = createEventDispatcher();

	let list_element: HTMLUListElement;

	function scroll_on_change(closest: Song) {
		if (closest === last_track || !list_element) return;

		last_track = closest;
		const current_list_element = Array.from(list_element.children)
			.filter((list_element) => list_element.id === String(closest.start))
			.at(0);

		if (current_list_element) {
			current_list_element.scrollIntoView();
		}
	}

	let last_track: Song | undefined;

	$: progress = $streamingData[$selectedRecording].progress;
	$: closest = cue.songs.reduce((prev, curr) => {
		return curr.start <= progress && curr.start > prev.start ? curr : prev;
	});
	$: scroll_on_change(closest);

	onMount(() => {
		scroll_on_change(closest);
	});
</script>

<nav>
	<ul bind:this={list_element}>
		{#each cue.songs as song, i}
			<li id={String(song.start)}>
				<button
					class={closest.start === song.start
						? 'current glow-sm'
						: progress >= song.start
							? 'played'
							: ''}
					on:click={() => dispatch('scrub', { start: song.start, audioURL: cue.slug })}
				>
					<!-- <span>[{timeStringFromSeconds(song.start)}]</span> -->
					<p>
						<span class="track_info_number">{i + 1}: </span><strong>{song.title}</strong>
					</p>
					<p class="track_info_seperator">/</p>
					<p>{song.artist}</p>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	ul {
		flex-direction: column;
		height: 20rem;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		width: 100%;
		gap: 1rem;

		li {
			scroll-snap-align: center;
			padding: calc(var(--nav-element-spacing-vertical) * 0.5)
				calc(var(--nav-element-spacing-horizontal) * 0.5);
			& button {
				display: block;
				max-width: 40ch;
				padding: calc(var(--nav-link-spacing-vertical) * 0.125)
					calc(var(--nav-element-spacing-horizontal) * 0.125);
				border-radius: calc(var(--border-radius) * 1.5);
				--background-color: transparent;
				--border-color: transparent;

				& p {
					margin-bottom: 0;
					--color: var(--contrast);
					font-size: 0.8em;

					&:first-of-type {
						--color: var(--accent-color);
						font-size: 1em;
					}

					&.track_info_seperator,
					.track_info_number {
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
						&:first-of-type {
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
						&:first-of-type {
							--color: color-mix(in srgb, var(--accent-color) 60%, rgba(0, 0, 0, 0.3));
							@media only screen and (prefers-color-scheme: light) {
								--color: color-mix(in srgb, var(--accent-color) 50%, rgba(255, 255, 255, 0.3));
							}
						}
					}
					&:hover p {
						--color: var(--contrast);
						&:first-of-type {
							--color: var(--accent-hover);
						}
					}
				}
			}
		}

		@media screen and (min-width: 768px) {
			align-items: start;

			& li button {
				max-width: unset;
				display: flex;
				gap: 0.5rem;
				text-align: left;

				& p {
					display: inline;
					width: fit-content;
					font-size: 1em;

					&.track_info_seperator,
					.track_info_number {
						display: initial;
					}
				}
			}
		}
	}
</style>
