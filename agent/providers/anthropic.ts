import Anthropic from '@anthropic-ai/sdk';
import type { Message } from 'ollama';
import type { ProviderConfig } from '../../config/types.ts';

export const executeAnthropic = async (
    conversation: Message[],
    config: ProviderConfig
): Promise<string> => {
    if (!config.apiKey) {
        throw new Error('Anthropic API key not configured. Use: settings anthropic apiKey <your-key>');
    }

    const anthropic = new Anthropic({ apiKey: config.apiKey });

    // Extract system message
    const systemMessage = conversation.find(msg => msg.role === 'system')?.content || '';
    
    // Convert messages (excluding system)
    const messages = conversation
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
        }));

    const response = await anthropic.messages.create({
        model: config.model,
        max_tokens: 4096,
        system: systemMessage,
        messages
    });

    const content = response.content[0];
    return content?.type === 'text' ? content.text : '';
};