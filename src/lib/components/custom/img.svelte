<script lang="ts">
	export let src = '';
	export let alt = '';
	export let loading: 'lazy' | 'eager' = 'lazy';
</script>

<img {src} {alt} {loading} />
