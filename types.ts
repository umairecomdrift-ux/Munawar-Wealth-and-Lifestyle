
export interface Framework {
  topicSummary: string;
  topicContext: string;
  coreFrameworks: Array<{
    name: string;
    points: string[];
    logic: string;
  }>;
  mentalModels: Array<{
    name: string;
    application: string;
  }>;
  decisionRules: string[];
  lifestyleTradeOffs: Array<{
    tradeOff: string;
    reality: string;
  }>;
  longTermPerspective: string;
  visualPrompts?: string[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  size: '1K' | '2K' | '4K';
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING_FRAMEWORK = 'LOADING_FRAMEWORK',
  LOADING_IMAGES = 'LOADING_IMAGES',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface GroundingSource {
  title: string;
  uri: string;
}
