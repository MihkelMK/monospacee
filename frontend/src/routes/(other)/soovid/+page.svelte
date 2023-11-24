<script lang="ts">
	import type { ActionData } from './$types';
	import SearchPreview from '$lib/components/SearchPreview.svelte';
	import { selectedSearchResult } from '$lib/store';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	export let form: ActionData;

	let retryCounter = 0;
	let formToggle = true;

	const resetSelection = () => {
		selectedSearchResult.set(undefined);
		resetRetries();
		if (form) form.tracks = [];
	};

	const resetRetries = () => {
		retryCounter = 0;
		if (form?.notFound) form.notFound = undefined;
	};

	$: submitText =
		retryCounter > 4 || form?.notFound
			? 'Try a different search'
			: retryCounter > 0
			  ? 'Search again'
			  : 'Search';
</script>

<div class="intro">
	<hgroup>
		<h3>Suggest a song</h3>
		<h4>
			Most of these will be played, but submission is not a guarantee that it will get played.
		</h4>
	</hgroup>
	<fieldset>
		<label for="switch">
			Spotify Link
			<input
				bind:checked={formToggle}
				on:change={() => resetSelection()}
				type="checkbox"
				id="switch"
				name="switch"
				role="switch"
			/>
			Search Spotify
		</label>
	</fieldset>
</div>

{#if formToggle}
	<form
		method="POST"
		action="?/search"
		on:submit={() => (retryCounter += 1)}
		use:enhance={() => {
			return async ({ update }) => {
				update({ reset: false });
			};
		}}
	>
		<label for="title">
			Title<span>*</span>
			<input type="text" on:keypress={() => resetRetries()} required id="title" name="title" />
		</label>
		<label for="artist">
			Artist
			<input type="text" on:keypress={() => resetRetries()} id="artist" name="artist" />
		</label>
		<button type="submit" disabled={retryCounter > 4 || form?.notFound}>{submitText}</button>
		<button class="contrast" type="reset" on:click={() => resetSelection()}>
			<iconify-icon inline icon="pixelarticons:trash" />
		</button>
		<input type="hidden" value={5 * retryCounter || 0} id="offset" name="offset" />
	</form>
{:else}
	<form method="POST" action="?/link" use:enhance>
		{#if form?.notFound}<p class="error">The link is invalid</p>{/if}
		<label for="title">
			URL<span>*</span>
			<input type="text" on:keypress={() => resetRetries()} required id="url" name="url" />
		</label>
		<button type="submit" disabled={retryCounter > 4 || form?.notFound}>{submitText}</button>
	</form>
{/if}

<div class="previews">
	{#if form?.status === 201 && form?.tracks}
		{#each form?.tracks as track}
			<SearchPreview data={track} />
		{/each}
	{/if}
</div>

{#if form?.message}
	<p class="status status_{$page.status}">{form.message}</p>
{/if}

<style lang="scss">
	.intro {
		place-self: center;
		margin-top: 4rem;
		hgroup {
			text-align: center;
		}

		fieldset {
			width: fit-content;
			margin-inline: auto;
		}
	}

	p.status {
		grid-column: 1/3;
	}

	form {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: 0 1rem;
		height: fit-content;

		& :not(button) {
			grid-column: 1/3;
		}

		& label span {
			color: var(--form-element-invalid-active-border-color);
			font-size: 1.25em;
			line-height: 1em;
			margin-inline-start: 0.1em;
		}
		@media screen and (min-width: 992px) {
			grid-auto-rows: minmax(0, auto);
		}
	}

	button {
		height: fit-content;
		place-self: center start;
		max-width: 25ch;

		&.contrast {
			width: fit-content;
			place-self: center end;

			iconify-icon {
				scale: 2;
			}
		}
	}

	.previews {
		@media screen and (min-width: 992px) {
			grid-row: 1/3;
			grid-column: 2/3;
			max-height: 70svh;
			overflow-y: scroll;
		}
	}
</style>
