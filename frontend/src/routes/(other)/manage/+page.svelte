<script lang="ts">
	import { enhance } from '$app/forms';
	import { openModal } from 'svelte-modals';
	import { page } from '$app/stores';

	import type { PageData } from './$types';
	import Modal from '$lib/components/Modal.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;

	const confirmSongRemove = async (event) => {
		const form = event.target.parentElement;
		const songTitle = form.elements.item(1).value;
		const songArtist = form.elements.item(2).value;

		openModal(Modal, {
			title: 'Confirm removal',
			message: 'Remove',
			messageBold: `${songTitle} / ${songArtist}?`,
			labels: {
				cancel: 'Cancel',
				confirm: 'Yes'
			},
			onConfirm: () => {
				form.submit();
				return true;
			},
			onCancel: () => {
				return false;
			}
		});
	};

	export let data: PageData;
</script>

<div class="intro">
	<hgroup>
		<h3>Welcome, {data.username}!</h3>
		<h4>Current party: {data.party}</h4>
	</hgroup>
</div>

{#if form?.message}
	<p class="status status_{$page.status}">{form.message}</p>
{/if}

<details>
	<summary>{data.songs.length} submissions</summary>
	<table>
		<thead>
			<tr>
				<th scope="col">Artist</th>
				<th scope="col">Title</th>
				<th scope="col">Remove</th>
			</tr>
		</thead>
		<tbody>
			{#each data.songs as song}
				<tr>
					<td>{song.artist}</td>
					<td>{song.title}</td>
					<td>
						<form
							method="post"
							action="?/removeSong"
							use:enhance={() => {
								return async ({ update }) => {
									update({ reset: false });
								};
							}}
						>
							<input type="hidden" value={song.id} id="id" name="id" />
							<input type="hidden" value={song.title} id="title" name="title" />
							<input type="hidden" value={song.artist} id="artist" name="artist" />

							<button
								on:click|preventDefault={confirmSongRemove}
								type="submit"
								class="outline secondary"
							>
								<iconify-icon inline icon="pixelarticons:trash" />
							</button>
						</form></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</details>


<style lang="scss">
	.intro {
		margin-top: 4rem;
		display: grid;
		grid-template-columns: minmax(0, auto) 12ch;
	}

	details {
		border-bottom: 0;

		& form,
		button {
			margin-bottom: 0;
		}

		& button {
			border: none;
			font-size: 2em;
			padding: 0;

			iconify-icon {
				pointer-events: none;
			}
		}
	}
</style>
