import type { ToolDefinition } from './types.ts';

import { readFileTool } from './read_file.ts';
import { listFilesTool } from './list_files.ts';
import { editFileTool } from './edit_file.ts';

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
	[readFileTool.name]: readFileTool,
	[listFilesTool.name]: listFilesTool,
	[editFileTool.name]: editFileTool,
};

export const ALL_TOOLS = Object.values(TOOL_REGISTRY);
