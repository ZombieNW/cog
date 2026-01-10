import { loadConfig, saveConfig } from '../config';
import { CLI_COLORS } from '../utils/colors.ts';

export const isSettingsCommand = (message: string): boolean =>
	message.trim().startsWith('settings');

export const handleSettingsCommand = async (
	message: string,
): Promise<string> => {
	const parts = message.trim().split(/\s+/);

	parts.shift(); // Remove prefix

	// cog settings
	if (parts.length === 0) {
		return showCurrentSettings();
	}

	// cog settings provider <provider>
	if (parts[0] === 'provider' && parts.length === 2) {
		if (!parts[1])
			return (
				CLI_COLORS.ERROR + 'Missing provider name' + CLI_COLORS.RESET
			);

		return switchProvider(parts[1]);
	}

	// cog settings <provider> <key> <value>
	if (parts.length >= 3) {
		const provider = parts[0];
		if (!provider)
			return (
				CLI_COLORS.ERROR + 'Missing provider name' + CLI_COLORS.RESET
			);

		const key = parts[1];
		if (!key) return CLI_COLORS.ERROR + 'Missing key' + CLI_COLORS.RESET;

		const value = parts.slice(2).join(' ');
		return setProviderSetting(provider, key, value);
	}

	return (
		CLI_COLORS.ERROR +
		'Invalid settings command. Usage:\n' +
		'  settings                           - Show current settings\n' +
		'  settings llm <provider>            - Switch LLM provider\n' +
		'  settings <provider> <key> <value>  - Set provider setting' +
		CLI_COLORS.RESET
	);
};

const showCurrentSettings = (): string => {
	const config = loadConfig();
	let output = CLI_COLORS.SUCCESS + 'Current Settings:\n' + CLI_COLORS.RESET;

	output += `Current Provider: ${CLI_COLORS.SUCCESS}${config.currentProvider}${CLI_COLORS.RESET}\n\n`;
	output += 'Available Providers:\n';

	for (const [name, settings] of Object.entries(config.providers)) {
		output += `\t${name}\n`;
		for (const [key, value] of Object.entries(settings)) {
			const displayValue =
				key.toLowerCase().includes('key') && value
					? '******' // Censor Keys
					: value || '(not set)'; // Show 'not set' if value is empty
			output += `\t  ${key}: ${displayValue}\n`;
		}
	}

	return output;
};

const switchProvider = (provider: string): string => {
	const config = loadConfig();

	if (!config.providers[provider]) {
		return (
			CLI_COLORS.ERROR +
			`Unknown LLM provider: ${provider}\n` +
			`Available providers: ${Object.keys(config.providers).join(', ')}` +
			CLI_COLORS.RESET
		);
	}

	config.currentProvider = provider;
	saveConfig(config);

	return CLI_COLORS.SUCCESS + `Switched to ${provider}` + CLI_COLORS.RESET;
};

const setProviderSetting = (
	provider: string,
	key: string,
	value: string,
): string => {
	const config = loadConfig();

	if (!config.providers[provider]) {
		return (
			CLI_COLORS.ERROR +
			`Unknown LLM provider: ${provider}` +
			CLI_COLORS.RESET
		);
	}

	config.providers[provider][key] = value;
	saveConfig(config);

	const displayValue = key.toLowerCase().includes('key') ? '******' : value; // Censor keys
	return (
		CLI_COLORS.SUCCESS +
		`Set ${provider}.${key} = ${displayValue}` +
		CLI_COLORS.RESET
	);
};
