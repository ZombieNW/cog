import type { ChatResponse, Message } from "ollama";

import ollama from "ollama";

export const executeLLMCall = async (conversation: Message[]): Promise<string> => {
    const response: ChatResponse = await ollama.chat({
        model: 'devstral-small-2',
        messages: conversation
    });

    return response.message.content;
}