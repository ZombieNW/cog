import { readFileSync, readdirSync, writeFileSync, statSync } from 'fs';
import { resolveAbsPath } from './utils/paths';
import { TOOL_REGISTRY } from './tools';
import ollama, { type ChatResponse, type Message } from 'ollama';

type ToolInvocation = [string, Record<string, any>];

const SYSTEM_PROMPT = `
You are a coding assistant whose goal it is to help solve coding tasks.

You have access to the following tools:

%s

To use a tool, reply with EXACTLY one line in this format:
tool: TOOL_NAME({{JSON_ARGS}})

Rules:
- One tool call per message
- Single-line compact JSON
- Double quotes only
- No extra text

If no tool is needed, respond normally.
`;

const CLI_COLORS = {
    YOU: '\u001b[94m',
    ASSISTANT: '\u001b[93m',
    ERROR: '\u001b[31m',
    RESET: '\u001b[0m'
}

// Get a string representation of a tool
const getToolStringRepresentation = (tool_name: string): string => {
    const tool = TOOL_REGISTRY[tool_name];
    if (!tool) throw new Error(`Unknown tool: ${tool_name}`);
    return `
Name: ${tool.name}
Description: ${tool.description}
Signature: ${JSON.stringify(tool.parameters)}
`;
}

const getFullSystemPrompt = (): string => {
    const tools = Object.values(TOOL_REGISTRY).map(tool => getToolStringRepresentation(tool.name)).join('\n');
    return SYSTEM_PROMPT.replace('%s', tools);
}

function extractToolInvocation(text: string): ToolInvocation | null {
    const line = text.trim();

    if (!line.startsWith("tool: ")) return null;

    try {
        const content = line.slice("tool: ".length); // Remove "tool: "

        // Find the first parenthesis to separate name from arguments
        const openParenIndex = content.indexOf("(");
        const closeParenIndex = content.lastIndexOf(")");

        // Make sure both parentheses exist and are in the correct order
        if (openParenIndex === -1 || closeParenIndex === -1 || closeParenIndex < openParenIndex) {
            return null;
        }

        const name = content.slice(0, openParenIndex).trim();
        const argsString = content.slice(openParenIndex + 1, closeParenIndex);

        const args = JSON.parse(argsString);

        return [name, args];
    } catch (error) {
        return null;
    }
}

const executeLLMCall = async (conversation: [Message]): Promise<string> => {
    const response: ChatResponse = await ollama.chat({
        model: 'devstral-small-2',
        messages: conversation
    });

    return response.message.content;
}

const runCodingAgentLoop = async () => {
    const conversation: [Message] = [{ role: 'system', content: getFullSystemPrompt() }];

    let userMessage = "";

    while (true) {
        try {
            userMessage = prompt(CLI_COLORS.YOU + "You: " + CLI_COLORS.RESET) || "";
        } catch (error) {
            console.log(CLI_COLORS.ERROR + "Error: " + CLI_COLORS.RESET, error);
            continue;
        }
        
        conversation.push({ role: 'user', content: userMessage });

        for (let i = 0; i < 5; i++) { // Cap the number of iterations at 5
            const assistantResponse = await executeLLMCall(conversation);
            conversation.push({ role: 'assistant', content: assistantResponse });

            const toolInvocation = extractToolInvocation(assistantResponse);
            if (toolInvocation) {
                const [toolName, args] = toolInvocation;
                const tool = TOOL_REGISTRY[toolName];
                if (!tool) {
                    console.log(CLI_COLORS.ERROR + "Error: " + CLI_COLORS.RESET, `Unknown tool: ${toolName}`);
                    continue;
                }
                const result = await tool.handler(args);
                conversation.push({ role: 'assistant', content: JSON.stringify(result) });
                break;
            } else {
                console.log(CLI_COLORS.ASSISTANT + "Assistant: " + CLI_COLORS.RESET, assistantResponse);
            }
        }
    }
}

runCodingAgentLoop();