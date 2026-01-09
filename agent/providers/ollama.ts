import ollama, { type ChatResponse, type Message } from 'ollama';
import type { ProviderConfig } from '../../config/types';

export const executeOllama = async (
    conversation: Message[],
    config: ProviderConfig
): Promise<string> => {
    const response: ChatResponse = await ollama.chat({
        model: config.model,
        messages: conversation
    });

    return response.message.content;
};