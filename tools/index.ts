import { readFileTool } from "./read_file";
import { listFilesTool } from "./list_files";
import { editFileTool } from "./edit_file";

import type { ToolDefinition } from "./types";

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  [readFileTool.name]: readFileTool,
  [listFilesTool.name]: listFilesTool,
  [editFileTool.name]: editFileTool
};

export const ALL_TOOLS = Object.values(TOOL_REGISTRY);
