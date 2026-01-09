export interface ToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, any>;
    handler: (args: any) => any | Promise<any>;
}