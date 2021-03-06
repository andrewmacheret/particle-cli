export default ({ commandProcessor, root }) => {
	const variable = commandProcessor.createCategory(root, 'variable', 'Retrieve and monitor variables on your device');

	const timeOption = {
		'time': {
			boolean: true,
			description: 'Show the time when the variable was received'
		}
	};

	commandProcessor.createCommand(variable, 'list', 'Show variables provided by your device(s)', {
		handler: (args) => {
			const VariableCommand = require('../cmd/variable');
			return new VariableCommand(args).listVariables();
		}
	});

	commandProcessor.createCommand(variable, 'get', 'Retrieve a value from your device', {
		params: '[device] [variableName]',
		options: timeOption,
		handler: (args) => {
			const VariableCommand = require('../cmd/variable');
			return new VariableCommand(args).getValue();
		},
		examples: {
			'$0 $command basement temperature': 'Read the temperature variable from the device basement'
		}
	});

	commandProcessor.createCommand(variable, 'monitor', 'Connect and display messages from a device', {
		params: '[device] [variableName]',
		options: Object.assign(timeOption, {
			'delay': {
				number: true,
				description: 'Interval in milliseconds between variable fetches',
			}
		}),
		handler: (args) => {
			const VariableCommand = require('../cmd/variable');
			return new VariableCommand(args).monitorVariables();
		},
		examples: {
			'$0 $command up temp --delay 2000': 'Read the temp variable from the device up every 2 seconds'
		}
	});

	return variable;
};
