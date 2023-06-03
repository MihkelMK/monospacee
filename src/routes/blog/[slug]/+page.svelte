<script lang="ts">
	import * as config from '$lib/config';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>{config.title + ' | ' + data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<h4>Published at: {formatDate(data.meta.date)}</h4>
	</hgroup>

	<div class="tags">
		{#each data.meta.categories as category}
			<a href={'/blog/category/' + category}>&num;{category}</a>
		{/each}
	</div>

	<div class="prose">
		<svelte:component this={data.content} />
	</div>
</article>
