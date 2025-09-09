import { FeedbackScore } from './FeedbackScore';
interface UserFeedbackPayload {
  type?: 'feedback';
  event_id: number;
  score: FeedbackScore;
  additionalProperties?: Map<string, any>;
}
export { UserFeedbackPayload };
