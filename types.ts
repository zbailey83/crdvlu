export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
