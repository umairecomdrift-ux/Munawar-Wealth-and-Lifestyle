
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
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING_FRAMEWORK = 'LOADING_FRAMEWORK',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface GroundingSource {
  title: string;
  uri: string;
}
