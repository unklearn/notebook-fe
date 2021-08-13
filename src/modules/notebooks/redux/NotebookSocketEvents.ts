import { WebsocketMessageAction } from "../../connection/Types";
import {
  NOTEBOOK_CONTAINER_UPDATE_STATUS_ACTION_TYPE,
  NOTEBOOK_UPDATE_FILE_CELL_ACTION_TYPE,
  UpdateFileCellInNotebookAction,
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

export function fileOutputSocketEventAction(
  socketEvent: WebsocketMessageAction
): UpdateFileCellInNotebookAction {
  const { channelId, data } = socketEvent.payload;
  const payload = safeJSONParse(decoder.decode(data));
  // Find notebookId by containerId, we may need to use backend details to send it down later.
  // file_path, content, error, cell_id
  return {
    type: NOTEBOOK_UPDATE_FILE_CELL_ACTION_TYPE,
    payload: {
      notebookId: payload.notebook_id,
      containerId: channelId,
      cellId: payload.cell_id,
      filePath: payload.file_path,
      content: payload.content,
    },
  };
}
