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
