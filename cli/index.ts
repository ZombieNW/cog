import { CodingAgent } from '../agent';
import { CLI_COLORS } from '../utils/colors';

export const runCLI = async () => {
    const agent = new CodingAgent();

    console.log(CLI_COLORS.ASSISTANT + "Cog loaded! Type prompts below." + CLI_COLORS.RESET);

    while (true) {
        try {
            const userMessage = prompt(CLI_COLORS.YOU + "You:" + CLI_COLORS.RESET) || "";

            if (!userMessage.trim()) continue;

            const response = await agent.chat(userMessage);
            console.log(CLI_COLORS.ASSISTANT + "Cog: " + CLI_COLORS.RESET, response);
        } catch (error) {
            console.log(CLI_COLORS.ERROR + "Error: " + CLI_COLORS.RESET, error);
        }
    }
}