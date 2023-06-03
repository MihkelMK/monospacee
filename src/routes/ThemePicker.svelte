<select data-choose-theme>
	<option value="dracula">Dracula</option>
	<option value="onedark">One Dark</option>
	<option value="seafoam">Seafoam</option>
	<option value="lightpink">Light Pink</option>
</select>

<style lang="scss">
	select {
		width: 1ch;
		float: right;
		align-self: end;
		border: none;
		background-color: var(--color-bg-0);
		color: var(--color-heading);
		outline: 0.1em solid var(--color-heading);
		border-radius: $radius-1;

		[value=''] * {
			color: var(--dracula-text);
			background-color: var(--dracula-bg);
		}

		[value='onedark'] * {
			color: var(--mono-text);
			background-color: var(--mono-bg);
		}

		[value='pink'] * {
			color: var(--pink-text);
			background-color: var(--pink-bg);
		}
		[value='seafoam'] * {
			color: var(--seafoam-text);
			background-color: var(--seafoam-bg);
		}
	}
</style>
