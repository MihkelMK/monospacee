<script lang="ts">
	import { selectedSearchResult } from '$lib/store';
	import type { SpotifySearchResult } from '$lib/types';

	export let data: SpotifySearchResult;

	const selectThisSong = () => {
		selectedSearchResult.set(data);
	};

	const truncateTitle = (title: string) => {
		if (title.length < 30) return title;
		return title.slice(0, 30) + '…';
	};

	$: selected = $selectedSearchResult?.id === data.id;
</script>

<article style="--image: url('{data.album.images.at(0)?.url}')">
	<hgroup>
		<h4>
			{truncateTitle(data.name)}
		</h4>
		<h5>
			{#each data.artists.slice(0, 3) as artist}
				<span>{artist.name}</span>
			{/each}
		</h5>
	</hgroup>
	<button
		class={selected ? 'contrast' : 'contrast outline'}
		disabled={selected}
		on:click={() => selectThisSong()}
	>
		{selected ? 'Selected' : 'Select'}
	</button>
</article>

<style lang="scss">
	article {
		border-radius: calc(var(--border-radius) * 2);
		display: grid;
		grid-template-columns: auto 12ch;
		place-items: center start;
		gap: 1.5rem;
		position: relative;
		background: transparent;
		margin-inline: 1rem;

		&:before {
			border-radius: calc(var(--border-radius) * 2);
			content: '';
			background-image: var(--image);
			background-size: cover;
			background-position: 50% 50%;
			background-repeat: no-repeat;
			position: absolute;
			width: 100%;
			height: 100%;
			z-index: -1;
			filter: blur(1px) brightness(0.4) saturate(0.4) opacity(0.5);
		}

		&:first-of-type {
			margin-top: 0;
		}
	}

	hgroup,
	button {
		margin-bottom: 0;
	}

	button:disabled {
		opacity: 1;
	}

	h5 {
		color: var(--secondary);
		& span:not(:last-of-type):after {
			content: ' | ';
		}
	}
</style>
