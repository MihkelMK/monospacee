<script>
	import { enhance } from '$app/forms';
</script>

<slot />

<footer>
	<nav>
		<form method="post" action="/manage?/logout" use:enhance>
			<button class="contrast outline" type="submit">Sign out</button>
		</form>
    <a class="contrast" href="/changepass">Change password</a>
		<a class="contrast" href="/newuser">Create new user</a>
	</nav>
</footer>

<style lang="scss">
	footer {
		width: 100%;
		min-width: min(100%, 30rem);
		font-family: var(--font-accent);
		position: fixed;
		bottom: 0;
		left: 50%;
		translate: -50%;

		padding: 1.25rem 10vw;

		box-shadow: var(--card-box-shadow);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		background: var(--progress-background-color);

		box-shadow: 0 0 0 100vmax var(--progress-background-color);
		clip-path: inset(0 -100vmax);

		& form {
			margin-bottom: 0;
			button {
				margin-bottom: 0;
			}
		}

		& nav {
			flex-direction: row;
			place-items: center;
		}
	}
</style>
