import { readFileSync, writeFileSync } from 'fs';

import type { ToolDefinition } from './types.ts';

import { resolveAbsPath } from '../utils/paths.ts';

export const editFileTool: ToolDefinition = {
	name: 'edit_file',
	description:
		'Edit a file by replacing old_content with new_content. If old_content is empty, the file will be created.',
	parameters: {
		type: 'object',
		properties: {
			path: {
				type: 'string',
				description: 'Path to the file to edit',
			},
			old_content: {
				type: 'string',
				description: 'Content to replace',
			},
			new_content: {
				type: 'string',
				description: 'Content to replace with',
			},
		},
	},
	handler: ({ path, old_content, new_content }) => {
		const fullPath = resolveAbsPath(path);

		if (!old_content) {
			writeFileSync(fullPath, new_content, { flag: 'wx' });
			return {
				path: fullPath,
				action: 'created',
			};
		}

		const original = readFileSync(fullPath, 'utf-8');

		if (!original.includes(old_content)) {
			return {
				path: fullPath,
				action: 'old_content_not_found',
			};
		}

		writeFileSync(fullPath, original.replace(old_content, new_content));
		return {
			path: fullPath,
			action: 'edited',
		};
	},
};
