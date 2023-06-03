import * as Terminal from 'javascript-terminal';

const themes = ['Dracula', 'One Dark', 'Seafoam', 'Light Pink'];

export default Terminal.CommandMapping.create({
	...Terminal.defaultCommandMapping,
	theme: {
		function: (state: any, opts: string[]) => {
			const options = opts.join(' ');

			switch (options) {
				case '':
					return {
						output: Terminal.OutputFactory.makeTextOutput(
							'Please enter a theme name or add -h as a flag to view help.'
						)
					};
				case '--help':
				case '-h':
					return {
						output: Terminal.OutputFactory.makeTextOutput(
							'Used to change the theme of this site.\n\nSyntax: theme nameOfTheme\nUse -l to list available themes.'
						)
					};
				case '-l':
					return {
						output: Terminal.OutputFactory.makeTextOutput(themes.join('\n'))
					};
				default:
					if (
						themes.find((theme) => {
							return theme.toLowerCase() === options.toLowerCase();
						}) == undefined
					) {
						return {
							output: Terminal.OutputFactory.makeErrorOutput({
								source: 'Command error',
								type: 'Check your syntax or theme name.'
							})
						};
					} else {
						document.documentElement.dataset.theme = options.toLowerCase().replace(' ', '');

						return {
							output: Terminal.OutputFactory.makeTextOutput(
								'Switched theme to ' + options[0].toUpperCase() + options.slice(1)
							)
						};
					}
			}
		},
		optDef: {}
	},
	socials: {
		function: (state: any, opts: string[]) => {
			return {
				output: Terminal.OutputFactory.makeTextOutput(
					'Please enter a theme name or add -h as a flag to view help.'
				)
			};
		},
		optDef: {}
	}
});
