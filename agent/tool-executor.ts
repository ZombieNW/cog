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
    const lines = text.split('\n');

    const toolLineIndex = lines.findIndex(line => line.startsWith('tool:'));
    if (toolLineIndex === -1) return null;

    try {
        const toolLine = lines[toolLineIndex] && lines[toolLineIndex].trim();
        if (!toolLine) return null;

        const match = toolLine.match(/^tool:\s*(\w+)\((.*)\)$/);
        if (!match) return null;

        const [, name, argsString] = match;
        if (!name || !argsString) return null;
        
        const args = JSON.parse(argsString);

        const commentary = lines.slice(0, toolLineIndex)
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join(' ');
        
        return {
            name,
            args,
            commentary: commentary || undefined
        };
    } catch {
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