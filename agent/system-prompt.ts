import { TOOL_REGISTRY } from '../tools';

const SYSTEM_PROMPT_TEMPLATE = `
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

const getToolDescription = (toolName: string): string => {
	const tool = TOOL_REGISTRY[toolName];
	if (!tool) throw new Error(`Unknown tool: ${toolName}`);

	return `
Name: ${tool.name}
Description: ${tool.description}
Signature: ${JSON.stringify(tool.parameters)}
`;
};

export const buildSystemPrompt = (): string => {
	const toolDescriptions = Object.keys(TOOL_REGISTRY)
		.map(getToolDescription)
		.join('\n');
	return SYSTEM_PROMPT_TEMPLATE.replace('%s', toolDescriptions);
};
