import OpenAI from 'openai';
import type { Message } from 'ollama';
import type { ProviderConfig } from '../../config/types';

interface OpenAIResponse {
    choices: { message: { content: string } }[];
}

export const executeOpenAI = async (
    conversation: Message[],
    config: ProviderConfig
): Promise<string> => {
    if (!config.apiKey) {
        throw new Error('OpenAI API key not configured. Use: settings openai apiKey <your-key>');
    }

    const openai = new OpenAI({ apiKey: config.apiKey });

    const response = await openai.chat.completions.create({
        model: config.model,
        messages: conversation.map(msg => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content
        }))
    });

    return response.choices[0]?.message.content!;
};