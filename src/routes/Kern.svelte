<script lang="ts">
	export let silmaNurk: number = 0;
	export let suu: String = '◡';
	export let paremSilm: String = "'";
	export let vasakSilm: String = "'";
</script>

<h1>
	<span class="sulg sulg-v">[</span><!--
--><span class="silm silm-v" style="rotate:{silmaNurk}deg;"
		>{vasakSilm}</span
	><!--
--><span class="suu">{suu}</span><!--
--><span
		class="silm silm-p"
		style="rotate:{silmaNurk}deg">{paremSilm}</span
	><!--
--><span class="sulg sulg-p">]</span>
</h1>

<style lang="scss">
	h1 {
		font-size: 4em;
		color: var(--secondary);
		font-weight: bold;
		letter-spacing: -0.4em;
		text-align: center;
		text-shadow: 0px 0px 0.2em var(--color-heading-glow);

		& span {
			letter-spacing: -0.1em;
			display: inline-block;

			&.silm {
				transform-origin: center;
				height: 0.8em;
				font-size: 0.9em;
				width: 1em;
			}

			&.suu {
				font-size: 0.9em;
				margin-inline: -0.2em;
			}
		}
	}
</style>
