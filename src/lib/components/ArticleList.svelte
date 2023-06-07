<script lang="ts">
	import type { Post } from '$lib/types';
	import { formatDate } from '$lib/utils';

	export let posts: Post[];
</script>

<div class="grid">
	{#each posts as post}
		<a href={'/blog/' + post.slug} class="title">
			<article class="post">
				<header>
					<strong>{post.title}</strong>
					{formatDate(post.date)}
				</header>
				<p class="description">{post.description}</p>
			</article>
		</a>
	{/each}
</div>

<style lang="scss">
	header {
		display: flex;
	}
</style>
