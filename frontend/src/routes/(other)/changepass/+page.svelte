<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';
	import type { PageData } from './$types';

	export let form: ActionData;
	export let data: PageData;
</script>

<hgroup>
	<h3>Hello, {data.username}!</h3>
	<h4>Change your password:</h4>
</hgroup>

<form method="POST" use:enhance>
	<input type="hidden" value={data.userId} id="userId" name="userId" />
	<label for="password">
		Password
		<input type="password" required name="password" autocomplete="current-password" id="password" />
	</label>
	<label for="new_password" style="margin-top: 2rem;">
		New Password
		<input
			type="password"
			required
			name="new_password"
			autocomplete="new-password"
			id="new_password"
		/>
	</label>
	<label for="confirm_password">
		Confirm New Password
		<input
			type="password"
			required
			name="confirm_password"
			autocomplete="new-password"
			id="confirm_password"
		/>
	</label>

	<button type="submit">Change</button>
	<a href="/manage">Return to dashboard</a>
</form>
{#if form?.message}
	<p class="status status_{$page.status}">{form.message}</p>
{/if}

<style>
	form {
		max-width: 40ch;
	}
</style>
