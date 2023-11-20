<script lang="ts">
	export let href: string;
	export let icon: string;
	export let label = 'our' + icon;
	export let iconClassName = '';
</script>

<a class={iconClassName} {href} target="_blank" referrerpolicy="no-referrer" aria-label={label}>
	<iconify-icon inline icon="mdi:{icon}" />
</a>
