<script lang="ts">
	import * as config from '$lib/config';
	import type { PageData } from './$types';
	import ArticleList from '$lib/components/ArticleList.svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>{config.title + ' - ' + data.category}</title>
</svelte:head>

<ArticleList posts={data.posts} />
