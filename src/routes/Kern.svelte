<script lang="ts">
	import { recordingPlaying } from './store';

	export let silmaNurk: number = 0;
	export let suu: String = '◡';
	export let paremSilm: String = "'";
	export let vasakSilm: String = "'";
</script>

<span class="kern {$recordingPlaying ? 'playing' : ''}">
	<span class="kern_klapitop contrast glow float">╭ ━━━━━ ╮</span>
	<span class="kern_klapid kern_klapid_v contrast glow float">d</span><!--
--><span
		class="kern_sulg kern_sulg_v secondary glow">[</span
	><!--
--><span class="kern_silm kern_silm_v secondary glow" style="rotate:{silmaNurk}deg;"
		>{vasakSilm}</span
	><!--
--><span class="kern_suu">{suu}</span><!--
--><span
		class="kern_silm kern_silm_p secondary glow"
		style="rotate:{silmaNurk}deg">{paremSilm}</span
	><!--
--><span class="kern_sulg kern_sulg_p secondary glow">]</span><!--
--><span
		class="kern_klapid kern_klapid_p contrast glow float">b</span
	>
</span>

<style lang="scss">
	.kern {
		font-size: 2.25rem;
		color: var(--secondary);
		font-weight: bold;
		text-align: center;
		display: grid;
		grid-template-rows: 0.4rem auto;

		& * {
			display: inline-block;
			place-self: start center;
		}

		&_silm {
			transform-origin: center;
			height: 0.9em;
			font-size: 0.9em;
			align-self: start;
		}

		&_suu {
			font-size: 0.9em;
			width: 0.5em;
			margin-left: -0.1em;
		}

		&_sulg {
			width: 0.6em;

			&_v {
				justify-self: end;
				letter-spacing: -0.1em;
			}
			&_p {
				justify-self: start;
			}
		}

		&_klapid {
			font-weight: normal;
			font-size: 0.85em;
			color: var(--color);
			margin-top: 0.2rem;

			&_v {
				letter-spacing: -0.225em;
			}
			&_p {
				margin-left: -0.15em;
				letter-spacing: 0em;
			}
		}

		&_klapitop {
			grid-column: span 8;
			align-self: center;
			margin-bottom: -0.8rem;
			margin-left: -0.28em;
			letter-spacing: -0.28em;
			color: var(--color);
		}

		& .float {
			opacity: 0;
			transition: opacity var(--transition);
			transition-duration: 0.5s;
			animation: float 4s infinite alternate;
			animation-play-state: paused;
		}

		&.playing {
			& .float {
				animation-play-state: running;
				opacity: 1;
			}
		}
	}

	@keyframes float {
		0% {
			translate: 0;
		}
		50% {
			translate: 0 -0.5rem;
		}
		100% {
			translate: 0 0.1rem;
		}
	}
</style>
