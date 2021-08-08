export const WEBSOCKET_CONNECTION_SUCCESS = "websocket/connection:success";
export const WEBSOCKET_CONNECTION_ERROR = "websocket/connection:error";
export const WEBSOCKET_DISCONNECTED_WITH_ERROR =
  "websocket/connection:disconnected-with-error";
export const START_WEBSOCKET_CONNECTION = "websocket/start-connection";
export const DISCONNECT_WEBSOCKET = "websocket/disconnect";
export const WEBSOCKET_DISCONNECTED_NORMALLY =
  "websocket/disconnected-normally";
export const WEBSOCKET_LISTENERS_ATTACHED = "websocket/listeners-attached";
export const WEBSOCKET_ON_MESSAGE = "websocket/on-message";
export const WEBSOCKET_SEND_MESSAGE = "websocket/send-message";

export interface StartWebsocketAction {
  type: typeof START_WEBSOCKET_CONNECTION;
  payload: {
    uri: string;
  };
}

export interface SendWebsocketMessageAction {
  type: typeof WEBSOCKET_SEND_MESSAGE;
  payload: {
    channelId: string;
    eventName: string;
    data: string | ArrayBuffer;
  };
}

/**
 * Start a new websocket connection to specified URI
 */
export function startWebsocketConnectionAction(
  uri: string
): StartWebsocketAction {
  return {
    type: START_WEBSOCKET_CONNECTION,
    payload: {
      uri,
    },
  };
}

/**
 * An action to send a websocket message
 * @param channelId The id of the channel
 * @param eventName The event name over the channel
 * @param data The data to send over the channel
 * @returns The action to send WS message
 */
export function sendWebsocketMessageAction(
  channelId: string,
  eventName: string,
  data: string | ArrayBuffer
): SendWebsocketMessageAction {
  return {
    type: WEBSOCKET_SEND_MESSAGE,
    payload: {
      channelId,
      eventName,
      data,
    },
  };
}
