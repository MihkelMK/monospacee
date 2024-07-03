<script lang="ts">
	import { timeStringFromSeconds } from '$lib/utils';
	import Marquee from '../Marquee.svelte';

	interface Props {
		loading: boolean;
		isPlaying: boolean;
		currentTime: number;
		duration: number;
		trackTitle: string;
		trackArtist: string;
		cueTitle: string;
	}

	let { loading, isPlaying, currentTime, duration, trackTitle, trackArtist, cueTitle }: Props =
		$props();
</script>

<span class="player_time player_time_current glow-sm {isPlaying ? 'contrast' : 'muted'}"
	>{timeStringFromSeconds(currentTime)}</span
>
{#if !loading}
	<span class="player_song">
		<Marquee
			class="player_song_scrolling"
			repeat={5}
			duration={18}
			paused={!isPlaying}
			pauseOnHover
		>
			<span class="player_song_text">
				<strong class="glow-sm {isPlaying ? 'contrast' : 'muted'}">{trackTitle}</strong>
				<span class="glow-sm {isPlaying ? 'secondary' : 'muted'}">/</span>
				<span class="glow-sm {isPlaying ? 'contrast' : 'muted'}">{trackArtist}</span>
			</span>
		</Marquee>
	</span>
	<span class="player_title glow-sm {isPlaying ? 'secondary' : 'contrast'}">{cueTitle}</span>
{:else}
	<span class="player_song" aria-busy={loading}></span>

	<span class="player_title glow-sm contrast" aria-busy={loading}></span>
{/if}
<span class="player_time player_time_total glow-sm {isPlaying ? 'contrast' : 'muted'}"
	>{timeStringFromSeconds(duration)}</span
>

<style lang="scss">
	.player {
		&_title {
			grid-area: title;
			place-self: center;
			z-index: -1;

			margin-bottom: -0.8rem;
			margin-top: 1rem;
			font-size: 1.1em;
			font-weight: bold;
			text-align: center;

			@media screen and (max-width: 768px) {
				margin: 0;
				font-size: 1.3em;
				word-wrap: normal;
				place-self: center;
			}

			&.secondary {
				color: var(--secondary);
			}
		}
		&_song {
			width: 100%;
			grid-area: track;
			place-self: end center;
			display: flex;
			justify-content: center;
			min-height: calc(2rem + var(--typography-spacing-vertical));
			background-color: var(--progress-background-color);
			padding-block: calc(var(--typography-spacing-vertical) * 0.5);
			border-radius: var(--border-radius);
			font-size: 1.1rem;

			@media screen and (max-width: 768px) {
				max-width: 100%;
				font-size: 1.2rem;
			}
			&_text {
				padding-inline: 2.5em;
				margin-bottom: -0.2rem;
				& .secondary {
					color: var(--secondary);
				}
				& .muted {
					color: var(--muted-color);
				}
			}
		}
		&_time {
			width: fit-content;
			margin-bottom: -0.8rem;
			margin-top: 1rem;
			font-size: 1.1rem;
			align-self: end;

			@media screen and (max-width: 768px) {
				margin: 0;
				font-size: 1.2em;
				align-self: center;
			}

			@media screen and (max-width: 576px) {
				display: none;
			}

			&_current {
				grid-area: current;
				justify-self: start;
				text-align: start;
			}
			&_total {
				grid-area: total;
				justify-self: end;
				text-align: end;
			}
		}
	}

	:global(.player_song_scrolling) {
		--mask: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 1) 10%,
			rgba(0, 0, 0, 1) 90%,
			rgba(0, 0, 0, 0) 100%
		);
		-webkit-mask: var(--mask);
		mask: var(--mask);

		width: calc(100% - 4rem);

		@media screen and (max-width: 768px) {
			width: calc(100cqw - 6rem);
		}
	}
</style>
