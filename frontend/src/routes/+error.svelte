<script lang="ts">
	import Kern from '$lib/components/Kern.svelte';
	import { page } from '$app/stores';
</script>

<section>
	<Kern suu="-" silmaNurk={0} vasakSilm="ˣ" paremSilm="ˣ" />
	<p>{$page.status}: {$page.error?.message}</p>
</section>

<style lang="scss">
	section {
		text-align: center;
		min-height: 90svh;
		display: grid;
		place-content: center;
	}
</style>
