<script lang="ts">
	export let currentTime: number;
	export let totalTrackTime: number;
	export let progress: number;
	export let isPlaying: boolean;

	let width: number;
	let screenWidth: number;

	$: opacity = isPlaying ? '1' : '0.6';

	function scrubTo(event: MouseEvent | TouchEvent) {
		let destination: number | undefined;

		if (event instanceof MouseEvent) destination = event.clientX;
		else if (event instanceof TouchEvent) {
			if (event.touches.length > 0) destination = event.touches.item(0)?.clientX;
			else if (event.changedTouches.length > 0) destination = event.changedTouches.item(0)?.clientX;
		}

		if (!destination) return;

		// Limit 100% to scrollbar size.
		destination = destination - (screenWidth - width) / 2;

		const percent = Math.ceil((destination * 100) / width);
		currentTime = (totalTrackTime * percent) / 100;
	}
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div
	class="player_progress"
	bind:clientWidth={width}
	on:click={scrubTo}
	on:keydown={() => {}}
	on:touchend={scrubTo}
>
	<span
		class="player_progress_bar"
		style="width: {progress}%; opacity:{opacity}"
	/>
</div>

<style lang="scss">
	.player_progress {
		grid-area: progress;
		width: 100%;
		background: var(--progress-background-color);
		height: 0.5rem;
		position: relative;
		border-radius: calc(var(--border-radius) * 0.25);
		place-self: end center;

		&_bar {
			position: absolute;
			height: 100%;
			transition: opacity var(--transition);
			background-image: linear-gradient(to right, var(--secondary), var(--primary));
			background-size: 100vw 100%;
			border-radius: 0 var(--border-radius) var(--border-radius) 0;
		}

		@media screen and (max-width: 768px) {
			place-self: end center;
			height: 0.75rem;
		}
	}
</style>
