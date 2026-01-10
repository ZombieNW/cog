import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

import type { Config } from './types.ts';

const isBunCompiled = process.execPath.endsWith('.js');
const CONFIG_PATH = isBunCompiled
	? join(process.execPath, 'cog.config.json')
	: join(__dirname, '..', 'cog.config.json'); // Determine if being interpreted or compiled/executed to determine config path

const DEFAULT_CONFIG: Config = {
	currentProvider: 'ollama',
	providers: {
		ollama: {
			model: 'devstral-small-2',
		},
		openai: {
			model: 'gpt-4o',
			apiKey: '',
		},
		gemini: {
			model: 'gemini-2.5-flash',
			apiKey: '',
		},
		anthropic: {
			model: 'claude-sonnet-4-20250514',
			apiKey: '',
		},
	},
};

export const loadConfig = (): Config => {
	// Create config file if it doesn't exist
	if (!existsSync(CONFIG_PATH)) {
		saveConfig(DEFAULT_CONFIG);
		return DEFAULT_CONFIG;
	}

	try {
		const content = readFileSync(CONFIG_PATH, 'utf-8');
		return JSON.parse(content);
	} catch (error) {
		console.error('Error loading config, using defaults:', error);
		return DEFAULT_CONFIG;
	}
};

export const saveConfig = (config: Config): void => {
	writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
};
