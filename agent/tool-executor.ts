import { TOOL_REGISTRY } from '../tools';

type ToolInvocation = {
    name: string;
    args: Record<string, any>;
};

type ToolExecutionResult = | { executed: false } | { executed: true; result: any };

const parseToolInvocation = (text: string): ToolInvocation | null => {
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

        return { name, args };
    } catch (error) {
        return null;
    }
}

export const executeToolIfNeeded = async (response: string): Promise<ToolExecutionResult> => {
    const invocation = parseToolInvocation(response);
    if (!invocation) return { executed: false };

    const tool = TOOL_REGISTRY[invocation.name];
    if (!tool) return { executed: false };

    const result = await tool.handler(invocation.args);
    return { executed: true, result };
}