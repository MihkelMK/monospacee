<script lang="ts">
	interface Props {
		href: string;
		icon: string;
		label?: string;
		iconClassName?: string;
	}

	let { href, icon, label = 'our' + icon, iconClassName = '' }: Props = $props();
</script>

<a class={iconClassName} {href} target="_blank" referrerpolicy="no-referrer" aria-label={label}>
	<iconify-icon inline icon="mdi:{icon}"></iconify-icon>
</a>
