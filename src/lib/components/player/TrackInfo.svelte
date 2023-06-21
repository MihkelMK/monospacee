<script lang="ts">
	export let currTimeDisplay = '';
	export let totalTimeDisplay = '';
	export let trackTitle = '';
	export let isPlaying: boolean;

	$: color = isPlaying ? 'var(--secondary)' : 'var(--color)';
</script>

<span class="player_time player_time_current">{currTimeDisplay}</span>
<span class="player_title" style="color: {color}">{trackTitle}</span>
<span class="player_time player_time_total">{totalTimeDisplay}</span>

<style lang="scss">
	.player {
		&_title {
			width: fit-content;
			grid-area: title;
			font-weight: bold;
			margin: 0;
			text-align: center;
			place-self: end center;
			margin-bottom: -1rem;
			margin-top: 0.5rem;
			margin-inline: 0.75em;
			white-space: pre-wrap;

			transition: color var(--transition);

			@media screen and (max-width: 768px) {
				margin: 0;
				font-size: 1.3em;
				word-wrap: normal;
				place-self: center;
			}
		}
		&_time {
			width: fit-content;
			margin-bottom: -1rem;

			@media screen and (max-width: 768px) {
				display: none;
			}

			&_current {
				grid-area: current;
				place-self: end start;
			}
			&_total {
				grid-area: total;
				place-self: end;
			}
		}
	}
</style>
