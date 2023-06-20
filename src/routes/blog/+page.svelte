<script lang="ts">
	import * as config from '$lib/config';
	import ArticleList from '$lib/components/ArticleList.svelte';

	export let data;
</script>

<svelte:head>
	<title>{config.title}</title>
</svelte:head>

<main>
<ArticleList posts={data.posts} />
{#await data.lazy.posts}
  <article class="post" aria-busy=true />
{:then posts}
  <ArticleList posts={posts} />
{/await}
</main>
