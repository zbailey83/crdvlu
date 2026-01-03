
/**
 * GroundingChunk interface updated to match the optionality of properties in the @google/genai SDK.
 * This resolves type incompatibility when assigning API responses to local state.
 */
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
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
