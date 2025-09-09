import { VadScoreData } from './VadScoreData';
interface VadScorePayload {
  type: 'vad_score';
  vad_score_event: VadScoreData;
  additionalProperties?: Map<string, any>;
}
export { VadScorePayload };
