<script lang="ts">
	import { recordingPlaying } from '$lib/store';

	export let silmaNurk: number = 0;
	export let suu: string = '◡';
	export let paremSilm: string = "'";
	export let vasakSilm: string = "'";

	$: if ($recordingPlaying) {
		silmaNurk = 0;
	}
</script>

<span class="maskott {$recordingPlaying ? 'playing' : ''}">
	<span class="noot noot-1 glow contrast">&#9835; &#9833;</span>
	<span class="noot noot-2 glow contrast">&#9833;</span>
	<span class="noot noot-3 glow contrast">&#9834;</span>
	<span class="noot noot-4 glow contrast">&#9839; &#9834;</span>
	<span class="noot noot-5 glow contrast">&#9835; &#9833;</span>
	<span class="noot noot-6 glow contrast">&#9834;</span>
	<span class="noot noot-7 glow contrast">&#9833;</span>
	<span class="noot noot-8 glow contrast">&#9839; &#9834;</span>

	<span class="kern">
		<span class="kern_sulg kern_sulg_v secondary glow">[</span><!--
--><span
			class="kern_silm kern_silm_v secondary glow"
			style="rotate:{silmaNurk}deg;">{$recordingPlaying ? '◕' : vasakSilm}</span
		><!--
--><span class="kern_suu">{suu}</span><!--
--><span
			class="kern_silm kern_silm_p secondary glow"
			style="rotate:{silmaNurk}deg">{$recordingPlaying ? '◕' : paremSilm}</span
		><!--
--><span class="kern_sulg kern_sulg_p secondary glow">]</span>
	</span>
</span>

<style lang="scss">
	.maskott {
		user-select: none;
		position: relative;

		&:not(.playing) .noot {
			--glow_color: transparent !important;
		}
	}
	.playing {
		& .kern,
		.kern * {
			animation-play-state: running;
		}

		& .kern {
			&_silm {
				font-size: 1.75rem;
				translate: 0 -0.6rem;
			}
		}
		& .noot {
			color: var(--muted-color);
		}
	}
	.kern {
		font-size: 2.25rem;
		color: var(--secondary);
		font-weight: bold;
		display: inline-block;
		animation:
			float 6s infinite alternate cubic-bezier(0.445, 0.05, 0.55, 0.95),
			float2 4s infinite alternate-reverse cubic-bezier(0.445, 0.05, 0.55, 0.95);
		animation-play-state: paused;
		animation-composition: accumulate;

		&_silm {
			transform-origin: center;
			height: 2rem;
			font-size: 2rem;
			width: 1rem;

			display: inline-block;
			animation-play-state: paused;
			translate: 0;
			&_v {
				animation-delay: 0.6s;
			}
			&_p {
				animation-delay: 1.8s;
			}
		}

		&_suu {
			font-size: 2rem;
			margin-left: -0.1rem;
			animation: float3 2s infinite alternate-reverse cubic-bezier(0.445, 0.05, 0.55, 0.95);
			animation-delay: 1.5s;
			display: inline-block;
			animation-play-state: paused;
			translate: 0;
		}

		&_sulg {
			margin-inline: 0.125rem;
			animation: float3 2s infinite alternate-reverse cubic-bezier(0.445, 0.05, 0.55, 0.95);
			display: inline-block;
			animation-play-state: paused;
			translate: 0;

			&_v {
				animation-delay: 0.5s;
				margin-inline-end: 0;
			}
			&_p {
				animation-delay: 1s;
			}
		}
	}

	.noot {
		position: absolute;
		color: transparent;
		animation-duration: 8s;
		animation-iteration-count: infinite;
		animation-timing-function: linear;

		font-size: 1rem;
		transition: color var(--transition);
		transition-duration: 1s;
		opacity: 0;

		&-1 {
			top: 1rem;
			right: 0;
			animation-delay: 1s;
			animation-name: notesL;
		}

		&-2 {
			top: 0.5rem;
			left: 5%;
			animation-delay: 2s;
			animation-name: notesR;
		}
		&-3 {
			top: 0.5rem;
			right: -5%;
			animation-delay: 3s;
			animation-name: notesL;
		}

		&-4 {
			top: 1.5rem;
			left: 5%;
			animation-delay: 4s;
			animation-name: notesR;
		}
		&-5 {
			top: 0.5rem;
			right: 5%;
			animation-delay: 5s;
			animation-name: notesL;
		}
		&-6 {
			top: 1rem;
			left: 0;
			animation-delay: 6s;
			animation-name: notesR;
		}
		&-7 {
			top: 0.5rem;
			right: 5%;
			animation-delay: 7s;
			animation-name: notesL;
		}
		&-8 {
			top: 0.5rem;
			left: -5%;
			animation-delay: 8s;
			animation-name: notesR;
		}
	}

	@keyframes float {
		0% {
			translate: 0 0;
		}
		25% {
			translate: 0 0.3rem;
		}
		50% {
			translate: 0 0;
		}
		75% {
			translate: 0 -0.3rem;
		}
		100% {
			translate: 0 0;
		}
	}

	@keyframes float2 {
		0% {
			translate: 0 0;
		}
		25% {
			translate: 0.1rem 0;
		}
		75% {
			translate: -0.1rem 0;
		}

		100% {
			translate: 0 0;
		}
	}

	@keyframes float3 {
		0% {
			translate: 0 0px;
		}

		50% {
			translate: 0 0.1rem;
		}

		100% {
			translate: 0 0px;
		}
	}

	@keyframes notesR {
		0% {
			transform: scale(1) translate(0, 0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		25% {
			opacity: 1;
			transform: scale(1.5) translate(-75%, -100%);
		}
		30% {
			opacity: 1;
		}
		49% {
			transform: scale(1.5) translate(-150%, -200%);
			opacity: 0;
		}
		50% {
			transform: scale(1) translate(0, 0);
			opacity: 0;
		}
		70% {
			opacity: 1;
		}
		75% {
			opacity: 1;
			transform: scale(1.5) translate(-50%, -100%);
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: scale(1.5) translate(-100%, -200%);
			opacity: 0;
		}
	}
	@keyframes notesL {
		0% {
			transform: scale(1) translate(0, 0);
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		25% {
			opacity: 1;
			transform: scale(1.5) translate(50%, -100%);
		}
		30% {
			opacity: 1;
		}
		49% {
			transform: scale(1.5) translate(100%, -200%);
			opacity: 0;
		}
		50% {
			transform: scale(1) translate(0, 0);
			opacity: 0;
		}
		70% {
			opacity: 1;
		}
		75% {
			opacity: 1;
			transform: scale(1.5) translate(75%, -100%);
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: scale(1.5) translate(150%, -200%);
			opacity: 0;
		}
	}
</style>
