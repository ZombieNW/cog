import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import type { Config } from './types.ts';

const CONFIG_PATH = join(process.cwd(), 'cog.config.json');

const DEFAULT_CONFIG: Config = {
    currentProvider: "ollama",
    providers: {
        ollama: {
            "model": "devstral-small-2"
        }, 
        openai: {
            "model": "gpt-4o",
            "apiKey": ""
        },
        gemini: {
            "model": "gemini-2.5-flash",
            "apiKey": ""
        },
        anthropic: {
            "model": "claude-sonnet-4-20250514",
            "apiKey": ""
        }
    }
};

export const loadConfig = (): Config => {
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
}

export const saveConfig = (config: Config): void => {
    writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
};
