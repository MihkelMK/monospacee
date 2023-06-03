<script lang="ts">
	import type { Post } from '$lib/types';
	import { formatDate } from '$lib/utils';

	export let posts: Post[];
</script>

<section>
	<ul class="posts">
		{#each posts as post}
			<li class="post">
				<a href={'/blog/' + post.slug} class="title">{post.title}</a>
				<p class="data">{formatDate(post.date)}</p>
				<p class="description">{post.description}</p>
			</li>
		{/each}
	</ul>
</section>
