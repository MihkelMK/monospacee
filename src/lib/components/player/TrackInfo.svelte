<script lang="ts">
	import Marquee from '../Marquee.svelte';

	export let currTimeDisplay = '';
	export let totalTimeDisplay = '';
	export let trackTitle = '';
	export let recTitle = '';
	export let isPlaying: boolean;
	export let loading: boolean;

	$: displayTitle = !loading;
</script>

<span class="player_time player_time_current glow-sm {isPlaying ? 'contrast' : 'muted'}"
	>{currTimeDisplay}</span
>
{#if displayTitle}
	<span class="player_song">
		<Marquee
			class="player_song_scrolling"
			repeat={5}
			duration={18}
			paused={!isPlaying}
			pauseOnHover
		>
			<span class="player_song_text">
				<strong class="glow-sm {isPlaying ? 'contrast' : 'muted'}"
					>{trackTitle.split('/')[0]}</strong
				>
				<span class="glow-sm {isPlaying ? 'secondary' : 'muted'}">/</span>
				<span class="glow-sm {isPlaying ? 'contrast' : 'muted'}">{trackTitle.split('/')[1]}</span>
			</span>
		</Marquee>
	</span>
	<span class="player_title glow-sm {isPlaying ? 'secondary' : 'contrast'}">{recTitle}</span>
{:else}
	<span class="player_title glow-sm contrast" aria-busy={loading} />
{/if}
<span class="player_time player_time_total glow-sm {isPlaying ? 'contrast' : 'muted'}"
	>{totalTimeDisplay}</span
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

			transition: color var(--transition);

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
			background-color: var(--progress-background-color);
			padding-block: calc(var(--typography-spacing-vertical) * 0.5);
			border-radius: var(--border-radius);
			box-shadow: var(--card-box-shadow);
			font-size: 1.1em;

			@media screen and (max-width: 768px) {
				max-width: 100%;
				font-size: 1.2em;
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
