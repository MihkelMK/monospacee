<script lang="ts">
	export let progress: number;
	export let isPlaying: boolean;

	$: background = isPlaying ? 'var(--secondary)' : 'var(--secondary-focus)';
</script>

<div class="player_progress">
	<span class="player_progress_bar" style="width: {progress}%; background:{background}" />
</div>

<style lang="scss">
	.player_progress {
		grid-area: progress;
		width: 100%;
		background: var(--progress-background-color);
		height: 0.3rem;
		position: relative;
		border-radius: calc(var(--border-radius) * 0.25);
		place-self: center;

		&_bar {
			position: absolute;
			height: 100%;
			border-radius: calc(var(--border-radius) * 0.25);
			transition: background var(--transition);
		}
	}
</style>
