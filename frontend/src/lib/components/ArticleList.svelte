<script lang="ts">
	import type { Post, PostType } from '$lib/types';
	import { formatDate } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { selectedRecording, visiblePostTypes } from '$lib/store';
	import { cubicOut } from 'svelte/easing';

	export let posts: Post[];

	const loadToPlayer = (slug: string) => {
		selectedRecording.set(slug);
	};

	const getClass = (type: PostType) => {
		if (type === 'event') return 'secondary';
		if (type === 'stream') return 'primary';
		return 'contrast';
	};
</script>

{#each posts as post}
	{#if $visiblePostTypes.includes(post.type)}
		<article
			transition:fly={{ y: 75, duration: 200, easing: cubicOut }}
			class="post {getClass(post.type)} {post.duration ? 'playable' : ''}"
		>
			<header>
				<hgroup>
					<a href={'/' + post.date} data-sveltekit-preload-data="tap" class="title">
						<h3 class="glow-sm">{post.title}</h3>
					</a>
					<h4>{formatDate(post.date)} [{post.type.slice(0, 1).toUpperCase()}]</h4>
				</hgroup>
				{#if post.duration}
					<button
						disabled={$selectedRecording === post.date}
						data-tooltip="Load to player"
						aria-label="Play this recording"
						on:click={() => loadToPlayer(post.date)}
					>
						<iconify-icon icon="pixelarticons:playlist" />
					</button>
				{/if}
			</header>
			<p class="description">{post.description}</p>
		</article>
	{/if}
{/each}
