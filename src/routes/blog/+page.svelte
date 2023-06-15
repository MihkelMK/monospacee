<script lang="ts">
	import * as config from '$lib/config';
	import ArticleList from '$lib/components/ArticleList.svelte';

	export let data;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<ArticleList posts={data.posts} lazyPosts={data.lazy.posts} />
