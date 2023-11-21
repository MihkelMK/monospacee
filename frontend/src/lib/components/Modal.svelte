<script lang="ts">
	import { closeModal } from 'svelte-modals';

	export let isOpen: boolean;

	export let onConfirm: () => void;
	export let onCancel: () => void;
	export let title: string;
	export let message = '';
	export let messageBold = '';
	export let labels = {
		cancel: 'Cancel',
		confirm: 'Confirm'
	};
</script>

<dialog open={isOpen}>
	<article>
		<header>
			<h4>
				{title}
			</h4>
		</header>
		<p>
			{#if message}
				{message}
			{/if}
			{#if messageBold}
				<strong>{messageBold}</strong>
			{/if}
		</p>
		<footer>
			<a
				href="#confirm"
				role="button"
				class=""
				on:click={() => {
					closeModal();
					onConfirm();
				}}
				>{labels.confirm}
			</a>
			<a
				href="#cancel"
				role="button"
				class="contrast outline"
				on:click={() => {
					closeModal();
					onCancel();
				}}
				>{labels.cancel}
			</a>
		</footer>
	</article>
</dialog>

<style lang="scss">
	article {
		min-width: min(25rem, 80svw);
		min-height: min(20rem, 80svh);
		display: grid;
		grid-template-rows: auto 1fr auto;
		place-items: center;
	}
	h4,
	p {
		margin-bottom: 0;
	}

	p {
		font-size: 1.15em;
	}

	footer,
	header {
		width: 100%;
		box-sizing: content-box;
	}
</style>
