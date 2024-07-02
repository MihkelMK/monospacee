<script lang="ts">
	import { selectedRecording, streamingData } from '$lib/store';
	import type { Cue, Song } from '$lib/types';

	interface Props {
		scrub: (start: number, audioURL: string) => void;
		cue: Cue;
	}

	let { cue, scrub }: Props = $props();

	let list_element: HTMLUListElement | undefined = $state();

	function scroll_on_change(last_track: Song | undefined) {
		if (closest === last_track || !list_element) return;

		last_track = closest;
		const current_list_element = Array.from(list_element.children)
			.filter((list_element) => list_element.id === String(closest.start))
			.at(0);

		if (current_list_element) {
			current_list_element.scrollIntoView();
		}
	}

	let last_track: Song | undefined = $state();

	let progress = $derived($streamingData[$selectedRecording].progress);
	let closest = $derived(
		cue.songs.reduce((prev, curr) => {
			return curr.start <= progress && curr.start > prev.start ? curr : prev;
		})
	);

	$effect(() => {
		scroll_on_change(last_track);
	});
</script>

<h3 id="tracklist">
	<span>Tracklist</span><small>[{cue.songs.indexOf(closest) + 1}/{cue.songs.length}]</small>
</h3>
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
					onclick={() => scrub(song.start, cue.slug)}
				>
					<p>
						<span class="track_info_number">{i + 1}:{' '}</span><strong>{song.title}</strong>
					</p>
					<p class="track_info_seperator">/</p>
					<p>{song.artist}</p>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	h3 {
		display: flex;
		justify-content: space-between;
		align-items: center;

		small {
			color: var(--muted-color);
		}
	}

	ul {
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
		height: 20rem;
		overflow-y: scroll;
		scroll-snap-type: y mandatory;
		scroll-behavior: smooth;
		width: 100%;

		li {
			scroll-snap-align: center;
			padding: calc(var(--nav-element-spacing-vertical) / 2) var(--nav-element-spacing-horizontal);
			& button {
				max-width: 40ch;
				padding: calc(var(--nav-element-spacing-vertical) * 0.75)
					calc(var(--nav-element-spacing-horizontal) * 2) !important;

				--background-color: transparent;
				--border-color: transparent;

				& p {
					margin-bottom: 0;
					--color: var(--contrast);
					font-size: 1em;

					&:first-of-type {
						--color: var(--accent-color);
						font-size: 1.1em;
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

			& li button {
				max-width: unset;
				display: flex;
				gap: 0.5rem;
				align-items: center;
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
