import { CodingAgent } from '../agent';
import { CLI_COLORS } from '../utils/colors';
import { handleSettingsCommand, isSettingsCommand } from "./settings.ts";

export const runCLI = async () => {
    const agent = new CodingAgent();

    console.log(CLI_COLORS.ASSISTANT + "Cog loaded! Type prompts below." + CLI_COLORS.RESET);

    while (true) {
        try {
            const userMessage = prompt(CLI_COLORS.YOU + "You:" + CLI_COLORS.RESET) || "";

            if (!userMessage.trim()) continue;

            // Check if it's a settings command
            if (isSettingsCommand(userMessage)) {
                const result = await handleSettingsCommand(userMessage);
                console.log(CLI_COLORS.ASSISTANT + result + CLI_COLORS.RESET);
                continue;
            }

            const { response, commentary } = await agent.chat(userMessage);

            if (commentary) console.log(CLI_COLORS.ASSISTANT + commentary + CLI_COLORS.RESET);
            console.log(CLI_COLORS.ASSISTANT + "Cog:" + CLI_COLORS.RESET, response);
        } catch (error) {
            console.log(CLI_COLORS.ERROR + "Error:" + CLI_COLORS.RESET, error);
        }
    }
}