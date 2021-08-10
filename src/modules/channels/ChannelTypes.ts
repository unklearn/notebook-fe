import { WebsocketMessageAction } from "../connection/Types";

export interface NotebookChannel {
  id: string;
  state: "connected" | "disconnected" | "pending";
  eventMap: Record<string, { offset: number; logs: (string | ArrayBuffer)[] }>;
}

export interface NotebookChannelReduxState {
  [id: string]: NotebookChannel;
}

export type ChannelActionTypes = WebsocketMessageAction;

export const CONTAINER_START_EVENT_NAME = "root/container-start";
export const CONTAINER_STATUS_EVENT_NAME = "root/container-status";
export const CONTAINER_STOP_EVENT_NAME = "root/container-stop";
export const CONTAINER_COMMAND_EXEC_EVENT_NAME = "container/execute-command";

/**
 * Converts a socket event received from server into a redux action
 * @param channelEventType The socket event name like "root/container-start";
 */
export function actionizeChannelEventType(channelEventType: string): string {
  return "action::" + channelEventType;
}
