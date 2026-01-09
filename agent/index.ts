import type { Message } from "ollama";

import { executeLLMCall } from "./llm.ts";
import { executeToolIfNeeded } from "./tool-executor.ts";
import { buildSystemPrompt } from "./system-prompt.ts";

export class CodingAgent {
    private conversation: Message[] = [];
    private maxIterations = 5;

    constructor() {
        this.reset();
    }

    async chat(userMessage: string): Promise<string> {
        this.conversation.push({role: 'user', content: userMessage});
        
        for (let i = 0; i < this.maxIterations; i++) {
            const assistantResponse = await executeLLMCall(this.conversation);
            this.conversation.push({role: 'assistant', content: assistantResponse});
            
            const toolResult = await executeToolIfNeeded(assistantResponse);

            if (toolResult.executed) {
                // Add tool result to conversation and continue loop
                this.conversation.push({role: 'assistant', content: JSON.stringify(toolResult.result)});
                continue;
            }

            // No tools use, return response
            return assistantResponse;
        }

        return "Maximum iterations reached.";
    }

    reset() {
        this.conversation = [{
            role: 'system',
            content: buildSystemPrompt()
        }];
    }
}