import { readdirSync, statSync } from "fs";
import { resolveAbsPath } from "../utils/paths";

import type { ToolDefinition } from "./types";

export const listFilesTool: ToolDefinition = {
    name: 'list_files',
    description: "List all files in a directory",
    parameters: {
        type: "object",
        properties: {
            path: {
                type: "string",
                description: "Path to the directory to list"
            }
        },
        required: ["path"]
    },
    handler: ({ path }) => {
        const fullPath = resolveAbsPath(path);

        const files = readdirSync(fullPath).map(file => ({
            filename: file,
            type: statSync(resolveAbsPath(`${path}/${file}`)).isDirectory() ? 'dir' : 'file'
        }));
        
        return {
            dir_path: fullPath,
            files
        };
    }
}