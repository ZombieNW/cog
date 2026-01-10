export interface ProviderConfig {
	model: string;
	apiKey?: string;
	[key: string]: any;
}

export interface Config {
	currentProvider: string;
	providers: {
		[provider: string]: ProviderConfig;
	};
}
