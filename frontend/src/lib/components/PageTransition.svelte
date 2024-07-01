<script lang="ts">
	import { fade } from 'svelte/transition';
	import { sineOut } from 'svelte/easing';

	export let url = '';
</script>

{#key url}
	<div class="transition" in:fade={{ duration: 250, easing: sineOut }}>
		<slot />
	</div>
{/key}
