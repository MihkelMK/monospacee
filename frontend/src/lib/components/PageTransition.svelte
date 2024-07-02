<script lang="ts">
	import { fade } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	interface Props {
		url?: string;
		children?: import('svelte').Snippet;
	}

	let { url = '', children }: Props = $props();
</script>

{#key url}
	<div class="transition" in:fade={{ duration: 300, easing: expoOut }}>
		{@render children?.()}
	</div>
{/key}
