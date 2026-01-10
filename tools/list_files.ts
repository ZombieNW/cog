import { readdirSync, statSync } from 'fs';

import type { ToolDefinition } from './types.ts';

import { resolveAbsPath } from '../utils/paths.ts';

export const listFilesTool: ToolDefinition = {
	name: 'list_files',
	description: 'List all files in a directory',
	parameters: {
		type: 'object',
		properties: {
			path: {
				type: 'string',
				description: 'Path to the directory to list',
			},
		},
		required: ['path'],
	},
	handler: ({ path }) => {
		const fullPath = resolveAbsPath(path);

		// Make list of all items in directory and label if it's a dir/file
		const files = readdirSync(fullPath).map((file) => ({
			filename: file,
			type: statSync(resolveAbsPath(`${path}/${file}`)).isDirectory()
				? 'dir'
				: 'file',
		}));

		return {
			dir_path: fullPath,
			files,
		};
	},
};
