import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Message } from 'ollama';
import type { ProviderConfig } from '../../config/types';

export const executeGemini = async (
    conversation: Message[],
    config: ProviderConfig
): Promise<string> => {
    if (!config.apiKey) {
        throw new Error('Gemini API key not configured. Use: settings gemini apiKey <your-key>');
    }

    // Extract system instruction
    const systemInstruction = conversation.find(msg => msg.role === 'system')?.content;

    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ 
        model: config.model,
        systemInstruction: systemInstruction ? {
            parts: [{ text: systemInstruction }],
            role: 'user'
        } : undefined
    });

    // Convert conversation to Gemini format (excluding system message)
    const history = conversation
        .filter(msg => msg.role !== 'system')
        .slice(0, -1) // Remove last message (will be sent as prompt)
        .map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

    const chat = model.startChat({ history });

    // Get the last user message
    const lastMessage = conversation[conversation.length - 1];
    const result = await chat.sendMessage(lastMessage!.content);
    
    return result.response.text();
};