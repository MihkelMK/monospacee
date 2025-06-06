<script lang="ts">
	import type { Post, PostType } from '$lib/types';
	import { formatDate, recordingPathFromDate } from '$lib/utils';
	import { fly } from 'svelte/transition';
	import { getAudioStore, visiblePostTypes } from '$lib/store.svelte';
	import { cubicOut } from 'svelte/easing';
	import { localizeHref } from '$lib/paraglide/runtime';

	interface Props {
		posts: Post[];
	}

	let { posts }: Props = $props();

	const audioStore = getAudioStore();

	const loadToPlayer = (date: string) => {
		const newPath = recordingPathFromDate(date);

		if (audioStore.selectedRecording !== newPath) {
			audioStore.setRecording(newPath);
		}
	};

	const getClass = (type: PostType) => {
		if (type === 'event') return 'secondary';
		if (type === 'stream') return 'primary';
		return 'contrast';
	};
</script>

{#each posts as post (post.title)}
	{#if $visiblePostTypes.includes(post.type)}
		<article
			transition:fly={{ y: 75, duration: 200, easing: cubicOut }}
			class="post {getClass(post.type)} {post.duration ? 'playable' : ''}">
			<header>
				<hgroup>
					<a href={localizeHref('/' + post.date)} data-sveltekit-preload-data="tap" class="title">
						<h3 class="glow-sm">{post.title}</h3>
					</a>
					<h4>{formatDate(post.date)} [{post.type.slice(0, 1).toUpperCase()}]</h4>
				</hgroup>
				{#if post.duration}
					<button
						disabled={audioStore.selectedRecording === recordingPathFromDate(post.date)}
						data-tooltip="Load to player"
						aria-label="Play this recording"
						onclick={() => loadToPlayer(post.date)}>
						<iconify-icon icon="pixelarticons:playlist"></iconify-icon>
					</button>
				{/if}
			</header>
			<p class="description">{post.description}</p>
		</article>
	{/if}
{/each}
