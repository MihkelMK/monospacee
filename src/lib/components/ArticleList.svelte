<script lang="ts">
	import type { Post } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import { page } from '$app/stores';

	export let posts: Post[];
</script>

{#each posts as post}
	<article class="post">
		<header>
			<hgroup>
				<a href={'/blog/' + post.date} class="title">
					<h2>{post.title}</h2>
				</a>
				<h3>{formatDate(post.date)}</h3>
			</hgroup>
			<nav>
				<ul>
					{#each post.categories as category}
						<li>
							<a
								data-tooltip={`Kõik ${category} postitused`}
								role="button"
								class={category === $page.params.tag ? 'secondary' : 'contrast outline'}
								href={'/blog/category/' + category}
							>
								<small>&num;{category}</small>
							</a>
						</li>
					{/each}
				</ul>
			</nav>
		</header>
		<p class="description">{post.description}</p>
	</article>
{/each}

<style lang="scss">
	header {
		display: grid;
		grid-template-columns: 4fr 1fr;
	}

	hgroup {
		margin-bottom: 0;
	}

	a {
		margin-bottom: 0;
		h2 {
			margin-bottom: calc(var(--typography-spacing-vertical) / 15);
			color: var(--primary);
		}
	}

	nav {
		place-self: center;
		li {
			padding-block: 0;
			a {
				padding-block: calc(var(--nav-link-spacing-vertical) * 0.125);
				border-radius: calc(var(--border-radius) * 1.5);

				@media screen and (max-width: 768px) {
					padding-block: calc(var(--nav-link-spacing-vertical) * 0.5);
					border-radius: calc(var(--border-radius) * 1.5);
				}
			}
		}
	}
</style>
