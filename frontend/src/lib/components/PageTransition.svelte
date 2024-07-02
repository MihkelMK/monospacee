<script lang="ts">
	import { fade } from 'svelte/transition';
	import { sineOut } from 'svelte/easing';

	interface Props {
		url?: string;
		children?: import('svelte').Snippet;
	}

	let { url = '', children }: Props = $props();
</script>

{#key url}
	<div class="transition" in:fade={{ duration: 250, easing: sineOut }}>
		{@render children?.()}
	</div>
{/key}
