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
export const CONTAINER_COMMAND_OUTPUT_EVENT_NAME = "command/output";
export const CONTAINER_COMMAND_INPUT_EVENT_NAME = "command/input";
export const CONTAINER_READ_FILE_EVENT_NAME = "container/sync-file";
export const CONTAINER_FILE_OUTPUT_EVENT_NAME = "container/file-output";
