import { TOOL_REGISTRY } from '../tools';

type ToolInvocation = {
    name: string;
    args: Record<string, any>;
    commentary?: string;
};

type ToolExecutionResult = 
    | { executed: false }
    | { executed: true; result: any; commentary?: string; toolName: string };

const parseToolInvocation = (text: string): ToolInvocation | null => {
    const lines: string[] = text.split('\n');
    let toolLine: string | null = null;
    let toolLineIndex = -1;
    
    // Find the line with tool invocation
    for (let i = 0; i < lines.length; i++) {
        if (lines[i]?.trim().startsWith("tool: ")) {
            toolLine = lines[i] || null;
            toolLineIndex = i;
            break;
        }
    }

    if (!toolLine) return null;

    try {
        const content = toolLine.trim().slice("tool: ".length);
        
        const openParenIndex = content.indexOf("(");
        const closeParenIndex = content.lastIndexOf(")");

        if (openParenIndex === -1 || closeParenIndex === -1 || closeParenIndex < openParenIndex) {
            return null;
        }

        const name = content.slice(0, openParenIndex).trim();
        const argsString = content.slice(openParenIndex + 1, closeParenIndex);
        const args = JSON.parse(argsString);

        // Extract commentary (everything before the tool line)
        const commentary = lines.slice(0, toolLineIndex)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(' ');

        return { 
            name, 
            args,
            commentary: commentary || undefined
        };
    } catch (error) {
        return null;
    }
};

export const executeToolIfNeeded = async (response: string): Promise<ToolExecutionResult> => {
    const invocation = parseToolInvocation(response);
    
    if (!invocation) {
        return { executed: false };
    }

    const tool = TOOL_REGISTRY[invocation.name];
    
    if (!tool) {
        throw new Error(`Unknown tool: ${invocation.name}`);
    }

    const result = await tool.handler(invocation.args);
    
    return { 
        executed: true, 
        result,
        commentary: invocation.commentary,
        toolName: invocation.name
    };
};