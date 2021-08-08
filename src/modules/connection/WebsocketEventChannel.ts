import { eventChannel, END } from "redux-saga";
import { WebsocketMultiplexDecoder } from "./Types";
import {
  WEBSOCKET_CONNECTION_ERROR,
  WEBSOCKET_CONNECTION_SUCCESS,
  WEBSOCKET_ON_MESSAGE,
} from "./WebsocketActions";

/**
 * Create a new websocket channel for listening to events
 *
 * The event channel takes care of emitting events received from websocket
 * namespace into saga's channel. This allows a root websocket saga to
 * take items from channel and dispatch actions that will be handled by
 * other sagas.
 *
 * @param  {MxedChannel} socket The multiplexed channel
 */
export default function createSocketEventChannel(
  socket: WebSocket,
  decoder: WebsocketMultiplexDecoder
) {
  return eventChannel((emit) => {
    socket.addEventListener("open", () => {
      if (socket.readyState === 1) {
        emit({
          type: WEBSOCKET_CONNECTION_SUCCESS,
        });
      }
    });

    socket.addEventListener("error", function (err) {
      emit({
        type: WEBSOCKET_CONNECTION_ERROR,
      });
    });

    socket.addEventListener(
      "message",
      async (e: MessageEvent<Blob | ArrayBuffer>) => {
        let data = e.data;
        if (e.data instanceof Blob) {
          data = await e.data.arrayBuffer();
        } else if (e.data instanceof ArrayBuffer) {
          data = e.data;
        }
        const resp = decoder(data as ArrayBuffer);
        emit({
          type: WEBSOCKET_ON_MESSAGE,
          payload: resp,
        });
      }
    );

    socket.addEventListener("close", () => {
      emit(END);
    });

    const unsubscribe = () => {
      socket.close();
    };

    return unsubscribe;
  });
}
