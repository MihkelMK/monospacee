<script lang="ts">
	export let duration = 15;
	export let repeat = 2;
	export let paused = false;
	export let pauseOnHover = false;

	let className = '';
	export { className as class };

	let hovered = false;
</script>

<div
	on:focus={() => (hovered = true)}
	role="marquee"
	aria-label="song title"
	on:focusout={() => (hovered = false)}
	on:mouseover={() => (hovered = true)}
	on:mouseleave={() => (hovered = false)}
	style="overflow: hidden;"
	class={className}
>
	<div class="content" class:paused={paused || (pauseOnHover && hovered)}>
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each { length: repeat } as _}
			<div class="text" style="animation-duration: {duration}s">
				<slot />
			</div>
		{/each}
	</div>
</div>

<style>
	.content {
		width: 100000px;
	}
	.text {
		animation-name: animation;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
		margin-top: 0.15em;
		float: left;
	}
	.paused .text {
		animation-play-state: paused;
	}
	@keyframes animation {
		100% {
			transform: translateX(-100%);
		}
	}
</style>
