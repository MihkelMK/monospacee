<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<hgroup>
	<h3>Welcome back!</h3>
	<h4>Please sign in</h4>
</hgroup>

<form method="POST" use:enhance>
	<label for="username">
		Username
		<input type="text" required id="username" autocomplete="username" name="username" />
	</label>
	<label for="password">
		Password
		<input type="password" required id="password" autocomplete="current-password" name="password" />
	</label>
	<button type="submit">Login</button>
</form>
{#if form?.message}
	<p class="status status_{$page.status}">{form.message}</p>
{/if}

<style>
	form {
		max-width: 40ch;
	}
</style>
