import { WebsocketMessageAction } from "../../connection/Types";
import {
  NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
  UpdateNotebookContainerStatusAction,
} from "./NotebookActions";

const decoder = new TextDecoder();

function safeJSONParse(payload: string) {
  try {
    return JSON.parse(payload);
  } catch {}
}

/**
 * An action that is dispatched when a container status socket event is fired
 * @param socketEvent A websocket message action on notebook channel with container status
 * @returns NotebookContainerStatusSocketAction
 */
export function notebookContainerStatusSocketEventAction(
  socketEvent: WebsocketMessageAction
): UpdateNotebookContainerStatusAction {
  const { channelId, data } = socketEvent.payload;
  const statusPayload = safeJSONParse(decoder.decode(data)) || {
    id: null,
    status: "",
  };
  return {
    type: NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
    payload: {
      notebookId: channelId,
      hash: statusPayload.hash,
      containerId: statusPayload.id,
      status: statusPayload.status,
    },
  };
}
