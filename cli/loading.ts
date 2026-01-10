import { CLI_COLORS } from '../utils/colors.ts';

export class LoadingIndicator {
	private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	private currentFrame = 0;
	private interval: Timer | null = null;

	start() {
		this.interval = setInterval(() => {
			process.stdout.write(
				`\r${CLI_COLORS.ASSISTANT}${this.frames[this.currentFrame]} Thinking...${CLI_COLORS.RESET}`,
			);
			this.currentFrame = (this.currentFrame + 1) % this.frames.length; // Cycle through frames
		}, 80);
	}

	stop() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		}
		process.stdout.write('\r\x1b[K'); // Clear the line
	}
}
