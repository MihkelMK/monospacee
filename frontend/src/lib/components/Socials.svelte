<script lang="ts">
	import type { SocialLink } from '$lib/types';
	import SocialIcon from './SocialIcon.svelte';

	interface Props {
		data: SocialLink[];
		class?: string;
		iconClass?: string;
	}

	let { data, class: className = '', iconClass: iconClassName = '' }: Props = $props();
</script>

<ul class={className}>
	{#each data as { href, icon, label } (label + href)}
		<li>
			<SocialIcon {iconClassName} {href} {icon} label={label ? label : undefined} />
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		display: flex;
		margin-bottom: 0;
		padding-left: 0;
		justify-content: center;
		gap: 0.75em;
		font-size: 0.8em;

		&:global(.landing) {
			font-size: 2rem;
		}
	}

	ul.inline {
		display: inline-flex;
		margin-inline-start: 0.5em;
	}

	li {
		list-style: none;
		margin-bottom: 0;
	}
</style>
