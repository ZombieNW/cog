import { readFileSync } from "fs";
import { resolveAbsPath } from "../utils/paths";

import type { ToolDefinition } from "./types";

export const readFileTool: ToolDefinition = {
    name: 'read_file',
    description: "Read and return the content of a file",
    parameters: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: "Path to the file to read"
            }
        },
        required: ["path"]
    },
    handler: ({ path }) => {
        const fullPath = resolveAbsPath(path);
        const content = readFileSync(fullPath, 'utf-8');

        return {
            file_path: fullPath,
            content
        }
    }
}