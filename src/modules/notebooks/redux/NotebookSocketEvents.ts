import { CONTAINER_STATUS_EVENT_NAME } from "../../channels/ChannelTypes";
import { WebsocketMessageAction } from "../../connection/Types";
import { ContainerConfiguration } from "../NotebookTypes";

export interface NotebookContainerStatusSocketAction {
  type: typeof CONTAINER_STATUS_EVENT_NAME;
  payload: {
    notebookId: string;
    id: string;
    status: ContainerConfiguration["status"];
  };
}

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
): NotebookContainerStatusSocketAction {
  const { channelId, data } = socketEvent.payload;
  const statusPayload = safeJSONParse(decoder.decode(data)) || {
    id: null,
    status: "",
  };
  return {
    type: CONTAINER_STATUS_EVENT_NAME,
    payload: {
      notebookId: channelId,
      id: statusPayload.id,
      status: statusPayload.status,
    },
  };
}
