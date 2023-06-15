<script lang="ts">
	import type { Post } from '$lib/types';
	import { formatDate } from '$lib/utils';

	export let posts: Post[];
	export let lazyPosts: Post[];
</script>

<div class="grid">
	{#each posts as post}
		<article class="post">
			<a href={'/blog/' + post.slug} class="title">
				<header>
					<strong>{post.title}</strong>
					{formatDate(post.date)}
				</header>
			</a>
			<p class="description">{post.description}</p>
		</article>
		{#if post.cue}
			{#each post.cue as track}
				<p>{track}</p>
			{/each}
		{/if}
	{/each}

	{#await lazyPosts}
		<article class="post" aria-busy="true" />
	{:then posts}
		{#each posts as post}
			<article class="post">
				<a href={'/blog/' + post.slug} class="title">
					<header>
						<strong>{post.title}</strong>
						{formatDate(post.date)}
					</header>
				</a>
				<p class="description">{post.description}</p>
			</article>
			{#if post.cue}
				{#each post.cue as track}
					<p>{track}</p>
				{/each}
			{/if}
		{/each}
	{/await}
</div>

<style lang="scss">
	header {
		display: flex;
	}
</style>
