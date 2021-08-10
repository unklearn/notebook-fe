import { EventChannel, Task } from "redux-saga";
import {
  put,
  take,
  cancel,
  call,
  fork,
  cancelled,
  takeLatest,
  race,
} from "redux-saga/effects";
import { DemuxedPayload } from "./Types";
import {
  DISCONNECT_WEBSOCKET,
  SendWebsocketMessageAction,
  StartWebsocketAction,
  START_WEBSOCKET_CONNECTION,
  WEBSOCKET_CONNECTION_ERROR,
  WEBSOCKET_CONNECTION_SUCCESS,
  WEBSOCKET_DISCONNECTED_NORMALLY,
  WEBSOCKET_SEND_MESSAGE,
} from "./WebsocketActions";
import createSocketChannel from "./WebsocketEventChannel";
import { socketDemuxer, socketMuxer } from "./WebsocketMultiplex";

export type SocketChannel = EventChannel<{
  type: string;
  payload: DemuxedPayload;
}>;

export function* receiveMessages(socketChannel: SocketChannel) {
  while (true) {
    // wait for a message from the channel
    const { type, payload }: { type: string; payload: DemuxedPayload } =
      yield take(socketChannel);
    // a message has been received, dispatch an action with the message payload
    yield put({
      type: type,
      payload: payload,
    });
  }
}

export function* sendMessage(socket: WebSocket) {
  // Wait for socket connection success
  yield take(WEBSOCKET_CONNECTION_SUCCESS);
  while (true) {
    const action: SendWebsocketMessageAction = yield take(
      WEBSOCKET_SEND_MESSAGE
    );
    const { channelId, eventName, data } = action.payload;
    // Mux and send
    yield call([socket, socket.send], socketMuxer(channelId, eventName, data));
  }
}

export function* prepareSocket(socket: WebSocket) {
  //let receiveTask: Task | undefined, sendTask: Task | undefined;
  let socketChannel: SocketChannel = yield call(
    createSocketChannel,
    socket,
    socketDemuxer
  );

  // const action : {type: string} = yield take(socketChannel as SocketChannel);
  // if (action.type === WEBSOCKET_CONNECTION_SUCCESS) {
  let receiveTask: Task = yield fork(
    receiveMessages,
    socketChannel as SocketChannel
  );
  let sendTask: Task = yield fork(sendMessage, socket);

  // In case of disconnect error or normal disconnect cancel stuff
  yield take([WEBSOCKET_CONNECTION_ERROR, WEBSOCKET_DISCONNECTED_NORMALLY]);
  if (receiveTask) {
    yield cancel(receiveTask);
  }
  if (sendTask) {
    yield cancel(sendTask);
  }
  socketChannel.close();
}

export function* websocketConnectSaga(action: StartWebsocketAction) {
  const socket = new WebSocket(action.payload.uri);
  // starts the task in the background
  yield fork(prepareSocket, socket);

  // when DISCONNECT action is dispatched, we cancel the socket task
  yield take(DISCONNECT_WEBSOCKET);
  yield put({
    type: WEBSOCKET_DISCONNECTED_NORMALLY,
  });
}

export function* websocketSagaWatcher() {
  yield takeLatest(START_WEBSOCKET_CONNECTION, websocketConnectSaga);
}
