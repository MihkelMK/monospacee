<script lang="ts">
	export let progress: number;
	export let isPlaying: boolean;

	$: opacity = isPlaying ? '1' : '0.6';
</script>

<div class="player_progress">
	<span class="player_progress_bar" style="width: {progress}%; opacity:{opacity}" />
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
			transition: opacity var(--transition);
			background-image: linear-gradient(to right, var(--secondary), var(--primary));
			/*                ↓ same as container width */
			background-size: 100vw 100%;
			border-radius: 0 var(--border-radius) var(--border-radius) 0;
		}

		@media screen and (max-width: 768px) {
			place-self: end center;
			height: 0.75rem;
		}
	}
</style>
