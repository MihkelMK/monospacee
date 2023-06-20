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
	<header>
		<hgroup>
			<h1>{data.meta.title}</h1>
			<h4>{formatDate(data.meta.date)}</h4>
		</hgroup>
		<nav>
			<ul>
				{#each data.meta.categories as category}
					<li>
						<a role="button" class="secondary" href={'/blog/category/' + category}
							><small>&num;{category}</small></a
						>
					</li>
				{/each}
			</ul>
		</nav>
	</header>

	<div class="prose">
		<svelte:component this={data.content} />
	</div>
</article>

<style lang="scss">
	hgroup {
		margin-bottom: calc(var(--typography-spacing-vertical) * 0.75);
	}

	nav {
		li {
			padding-block: 0;
			a {
				padding-block: calc(var(--nav-link-spacing-vertical) * 0.125);
				border-radius: calc(var(--border-radius) * 1.5);
			}
		}
	}

	.prose {
		:global(h2#sisukord) {
			margin-bottom: 0;
		}
	}
</style>
