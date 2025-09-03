import VadScoreData from './VadScoreData';
interface VadScorePayload {
  reservedType: 'vad_score';
  vadScoreEvent: VadScoreData;
  additionalProperties?: Map<string, any>;
}
export default VadScorePayload;
