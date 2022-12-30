<script lang="ts">
	import Keydown from 'svelte-keydown';
	import * as Terminal from 'javascript-terminal';
	// https://github.com/rohanchandra/javascript-terminal

	export const promptChar = '➜';
	let input = '';
	let output: { class: string; body: string }[] = [];

	// Utilities

	const addOutput = (className: string, textContent: string) => {
		output = [...output, { class: className, body: textContent }];
	};

	const parseOutput = {
		[Terminal.OutputType.TEXT_OUTPUT_TYPE]: (content: string) => addOutput('text-output', content),
		[Terminal.OutputType.TEXT_ERROR_OUTPUT_TYPE]: (content: string) =>
			addOutput('error-output', content.replace('emulator:', 'mono:')),
		[Terminal.OutputType.HEADER_OUTPUT_TYPE]: (content: { command: any }) =>
			addOutput('header-output', `${content.command}`)
	};

	const displayOutputs = (outputs: any[]) => {
		output = [];

		outputs.map((output) => parseOutput[output.type](output.content));
	};

	const clearInput = () => {
		input = '';
	};

	// Execution
	// TO-DO add functional commands
	const emulator = new Terminal.Emulator();

	let emulatorState = Terminal.EmulatorState.createEmpty();
	const historyKeyboardPlugin = new Terminal.HistoryKeyboardPlugin(emulatorState);
	const plugins = [historyKeyboardPlugin];
</script>

<Keydown
	pauseOnInput
	on:ArrowRight={(e) => {
		e.preventDefault();
		const autoCompletionStr = emulator.autocomplete(emulatorState, input);

		input = autoCompletionStr;
	}}
	on:ArrowDown={(e) => {
		e.preventDefault();
		input = historyKeyboardPlugin.completeDown();
	}}
	on:ArrowUp={(e) => {
		e.preventDefault();
		input = historyKeyboardPlugin.completeUp();
	}}
	on:Enter={(e) => {
		e.preventDefault();
		emulatorState = emulator.execute(emulatorState, input, plugins);
		displayOutputs(emulatorState.getOutputs());
		clearInput();
	}}
	on:Backspace={(e) => {
		e.preventDefault();
		input = input.slice(0, -1);
	}}
	on:key={(e) => {
		e.preventDefault();
		if (e.detail.length == 1) input += e.detail;
	}}
/>

<section class="console">
	<div class="console-viewport">
		<div class="console-history">
			{#each output as command, index}
				{#if command.class == 'header-output'}
					{#if output[index + 1] && output[index + 1].class == 'error-output'}
						<p class={command.class}>
							<span class="prompt error">{promptChar} </span><span class="command error"
								>{command.body.split(' -')[0]}</span
							><span class="flags error">
								{command.body.replace(command.body.split(' -')[0], '')}</span
							>
						</p>
					{:else}
						<p class={command.class}>
							<span class="prompt">{promptChar} </span><span class="command"
								>{command.body.split(' -')[0]}</span
							><span class="flags"> {command.body.replace(command.body.split(' -')[0], '')}</span>
						</p>
					{/if}
				{:else}
					<p class={command.class}>{command.body}</p>
				{/if}
			{/each}
		</div>
		<div class="console-input">
			<p>
				<span class="prompt">{promptChar} </span><span class="command">{input.split(' -')[0]}</span
				><span class="flags"> {input.replace(input.split(' -')[0], '')}</span>
			</p>
		</div>
	</div>
</section>

<style lang="scss">
	.console {
		box-shadow: 2px -4px 8px 3px var(--color-bg-0-glow);
		background-color: var(--color-bg-1);
		border-radius: $radius-2;
		margin: 1rem 0;
		width: 80%;
		overflow-y: scroll;
		height: 50vh;
		transform: rotateX(180deg);

		& p {
			margin-bottom: 0em;
		}

		& .prompt {
			color: var(--color-theme-2);
		}

		& .command {
			color: var(--color-theme-2);
		}

		& .flags {
			color: var(--color-theme-4);
		}

		& .error {
			color: var(--color-theme-1) !important;
		}

		&-viewport {
			transform: rotateX(180deg);
			width: 100%;
			height: fit-content;
			position: relative;
		}

		&-input {
			width: 100%;
			box-sizing: border-box;
			color: var(--color-text);
			padding-inline: 1em;
			padding-bottom: 1em;

			&:focus-visible {
				opacity: 1;
				outline: 0;
				border: 0;
			}
		}

		&-history {
			padding-inline: 1em;
			margin-block-end: 1em;

			& .header-output {
				margin-top: 1em;
			}
		}

		@media (hover: none) {
			overflow-y: hidden;
		}
	}
</style>
