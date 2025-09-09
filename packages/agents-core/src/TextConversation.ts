import { createConnection } from "./utils/ConnectionFactory";
import type { BaseConnection } from "./utils/BaseConnection";
import { applyDelay } from "./utils/applyDelay";
import { BaseConversation, type PartialOptions } from "./BaseConversation";

export class TextConversation extends BaseConversation {
  public static async startSession(
    options: PartialOptions
  ): Promise<TextConversation> {
    const fullOptions = BaseConversation.getFullOptions(options);

    if (fullOptions.onStatusChange) {
      fullOptions.onStatusChange({ status: "connecting" });
    }
    if (fullOptions.onCanSendFeedbackChange) {
      fullOptions.onCanSendFeedbackChange({ canSendFeedback: false });
    }
    if (fullOptions.onModeChange) {
      fullOptions.onModeChange({ mode: "listening" });
    }
    if (fullOptions.onCanSendFeedbackChange) {
      fullOptions.onCanSendFeedbackChange({ canSendFeedback: false });
    }

    let connection: BaseConnection | null = null;
    try {
      await applyDelay(fullOptions.connectionDelay);
      connection = await createConnection(options);
      return new TextConversation(fullOptions, connection);
    } catch (error) {
      if (fullOptions.onStatusChange) {
        fullOptions.onStatusChange({ status: "disconnected" });
      }
      connection?.close();
      throw error;
    }
  }
}
