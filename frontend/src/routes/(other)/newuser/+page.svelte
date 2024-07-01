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
	<h4>Create a new user:</h4>
</hgroup>

<form method="POST" use:enhance>
	<label for="username">
		Username
		<input type="text" name="username" required id="username" />
	</label>
	<label for="password">
		Password
		<input type="password" required name="password" autocomplete="new-password" id="password" />
	</label>
	<button type="submit">Create</button>
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
