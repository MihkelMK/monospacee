<script>
	/**
	 * @type {String[]}
	 */
	let history = [];

	// @ts-ignore
	const addHelp = (event) => {
		history = [...history, '</br>'];
		if (event) {
			const command = event.target[0].value;
			const program = event.target[0].value.split(' ')[0];
			const flags = event.target[0].value.replace(program, '');
			if (command == 'monosp') {
				history = [
					...history,
					'<span class="delay-0" style="color: var(--color-theme-2">➜ ' +
						program +
						'</span><span class="delay-0" style="color: var(--color-theme-4)">' +
						flags +
						'</span>',
					'<p class="delay-1" style="margin:0">type monosp --help for more info</p>'
				];
			} else if (
				command == 'monosp --help' ||
				command == 'monosp -h' ||
				program == 'help' ||
				program == '?'
			) {
				history = [
					...history,
					'<span class="delay-0" style="color: var(--color-theme-2)">➜ ' +
						program +
						'</span><span class="delay-0" style="color: var(--color-theme-4)">' +
						flags +
						'</span>',
					'<p class="delay-1" style="margin:0">Website for the DJ duo called monospacee.</p><a class="delay-1" style="margin:0" href="https://dysaster.ee">Part of Dysaster collective</a><p class="delay-1" style="margin: 1em 0 0 4ch"><strong>--help:</strong> The only command right now.</p><p class="delay-1" style="margin: 0 0 0 12.4ch">More features in the near future.</p>'
				];
			} else {
				const program = event.target[0].value.split(' ')[0];
				const flags = event.target[0].value.replace(program, '');
				history = [
					...history,
					'<span class="delay-0" style="color: var(--color-theme-1)">➜ ' +
						program +
						'</span><span class="delay-0" style="color: var(--color-theme-4)">' +
						flags +
						'</span>',
					'<p class="delay-1" style="margin:0">command not found: ' + program + '</p>'
				];
			}
			event.target[0].value = '';
		} else {
			history = [
				...history,
				'<span style="color: var(--color-theme-2)">➜ monosp</span><span style="color: var(--color-theme-4)"> --help</span>',
				'<p style="margin:0">Website for the DJ duo called monospacee.</p><a style="margin:0" href="https://dysaster.ee">Part of Dysaster the collective</a><p style="margin: 1em 0 0 4ch"><strong>--help:</strong> The only command right now.</p><p style="margin: 0 0 0 12.4ch">More features in the near future.</p>'
			];
		}
	};
	addHelp(false);
</script>

<div class="console">
	<form on:submit={addHelp} class="console-viewport">
		<div class="console-history">
			{#each history as line}
				<p>{@html line}</p>
			{/each}
		</div>
		<label class="console-input-label" for="text">➜</label>
		<!-- svelte-ignore a11y-autofocus -->
		<input class="console-input" autofocus type="text" />
	</form>
</div>

<style lang="scss">
	.console {
		display: flex;
		background-color: $color-bg-1;
		border-radius: $radius-2;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		margin: 1rem 0;
		width: 80%;
		overflow-y: scroll;
		height: 40vh;
		transform: rotateX(180deg);

		&-viewport {
			transform: rotateX(180deg);
			width: 100%;
			height: fit-content;
			position: relative;
		}

		&-input {
			height: 3em;
			width: 100%;
			box-sizing: border-box;
			background-color: $color-bg-2;
			color: $color-text;
			border: 0;
			opacity: 0.8;
			padding: 0.5em 2em;
			border-radius: $radius-2;

			&-label {
				position: absolute;
				z-index: 999;
				padding: 0.3975em 0.5em;
				font-size: 1.5em;
				display: block;
				color: $color-theme-2;
				margin-right: -1em;
				font-weight: bold;
			}

			&:focus-visible {
				opacity: 1;
				outline: 0;
				border: 0;
			}
		}

		&-history {
			padding-inline: 1em;
			margin-block-end: 1em;

			.delay-0 {
				animation: fadeIn 0s forwards;
			}

			.delay-1 {
				animation: fadeIn 0.15s forwards;
				animation-delay: 0.1s;
			}

			p {
				line-height: 1.5em;
				margin: 0;

				* {
					line-height: 1em;
				}
			}
		}
	}

	@keyframes fadeIn {
		0% {
			height: 0;
			opacity: 0;
		}
		100% {
			height: unset;
			opacity: 1;
		}
	}
</style>
