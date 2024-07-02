<script lang="ts">
	interface Props {
		duration?: number;
		repeat?: number;
		paused?: boolean;
		pauseOnHover?: boolean;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		duration = 15,
		repeat = 2,
		paused = false,
		pauseOnHover = false,
		class: className = '',
		children
	}: Props = $props();

	let hovered = $state(false);
</script>

<div
	onfocus={() => (hovered = true)}
	role="marquee"
	aria-label="song title"
	onfocusout={() => (hovered = false)}
	onmouseover={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	style="overflow: hidden;"
	class={className}
>
	<div class="content" class:paused={paused || (pauseOnHover && hovered)}>
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{#each { length: repeat } as _}
			<div class="text" style="animation-duration: {duration}s">
				{@render children?.()}
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
