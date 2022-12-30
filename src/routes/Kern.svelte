<script lang="ts">
	export let silmaNurk: number = 0;
	export let suu: String = '-';
	export let silm: String = "'";
</script>

<h1>
	<span class="sulg sulg-v">[</span>
	<span class="silm silm-v" style="rotate:{silmaNurk}deg">{silm}</span><!--
--><span class="suu"
		>{suu}</span
	><!--
--><span class="silm silm-v" style="rotate:{silmaNurk}deg">{silm}</span>
	<span class="sulg sulg-p">]</span>
</h1>

<style lang="scss">
	h1 {
		color: $color-theme-2;
		font-size: 4em;
		font-weight: bold;
		letter-spacing: -0.4em;
		text-align: center;
		text-shadow: 0px 0px 0.2em $color-theme-2-glow;

		& span {
			letter-spacing: -0.1em;
			display: inline-block;

			&.silm {
				transform-origin: center;
				height: 0.8em;
			}

			&.suu {
				width: 1.1ch;
				font-size: 0.9em;
			}
		}
	}
</style>
