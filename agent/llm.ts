import type { Message } from 'ollama';
import { loadConfig } from '../config';
import { executeOllama } from './providers/ollama.ts';
import { executeOpenAI } from './providers/openai.ts';
import { executeGemini } from './providers/gemini.ts';
import { executeAnthropic } from './providers/anthropic.ts';

export const executeLLMCall = async (conversation: Message[]): Promise<string> => {
    const config = loadConfig();
    const provider = config.currentProvider;
    const providerConfig = config.providers[provider];

    if (!providerConfig) {
        throw new Error(`No configuration found for provider: ${provider}`);
    }

    switch (provider) {
        case 'ollama':
            return executeOllama(conversation, providerConfig);
        case 'openai':
            return executeOpenAI(conversation, providerConfig);
        case 'gemini':
            return executeGemini(conversation, providerConfig);
        case 'anthropic':
            return executeAnthropic(conversation, providerConfig);
        default:
            throw new Error(`Unsupported LLM provider: ${provider}`);
    }
};