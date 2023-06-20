<script lang="ts">
	import * as config from '$lib/config';
	import ArticleList from '$lib/components/ArticleList.svelte';

	export let data;
</script>

<svelte:head>
	<title>{config.title + ' | ' + data.category}</title>
</svelte:head>

<main>
<ArticleList posts={data.posts} />
</main>
