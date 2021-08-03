import { EventChannel, Task } from 'redux-saga';
import { put, take, cancel, call, fork, cancelled } from 'redux-saga/effects';
import { DemuxedPayload } from './Types';
import { DISCONNECT_WEBSOCKET, WEBSOCKET_CONNECTION_ERROR, WEBSOCKET_CONNECTION_SUCCESS, WEBSOCKET_DISCONNECTED_NORMALLY, WEBSOCKET_DISCONNECTED_WITH_ERROR, WEBSOCKET_LISTENERS_ATTACHED, WEBSOCKET_SEND_MESSAGE } from './WebsocketActions';
import createSocketChannel from './WebsocketEventChannel';
import { socketDemuxer, socketMuxer } from './WebsocketMultiplex';

type SocketChannel = EventChannel<{ type: string, payload: DemuxedPayload }>;

export function* receiveMessages(socketChannel: SocketChannel) {
    while (true) {
        // wait for a message from the channel
        const { type, payload } = yield take(socketChannel);

        // a message has been received, dispatch an action with the message payload
        yield put({
            type,
            payload
        });
    }
}

export function* sendMessage(socket: WebSocket) {
    while (true) {
        const { channelId, eventName, data } = yield take(WEBSOCKET_SEND_MESSAGE);
        // Mux and send
        yield call(socket.send, socketMuxer(channelId, eventName, data));
    }
}

export function* prepareSocket(socket: WebSocket) {
    let socketChannel: SocketChannel | undefined;
    let receiveTask: Task | undefined, sendTask: Task | undefined;
    try {

        socketChannel = yield call(createSocketChannel, socket, socketDemuxer);

        // tell the application that we have a connection
        yield put({
            type: WEBSOCKET_CONNECTION_SUCCESS
        });
        receiveTask = yield fork(receiveMessages, socketChannel as SocketChannel);
        sendTask = yield fork(sendMessage, socket);

        yield put({
            type: WEBSOCKET_LISTENERS_ATTACHED
        });
    } catch (error) {
        yield put({
            type: WEBSOCKET_CONNECTION_ERROR,
            payload: {
                reason: error
            }
        });
    } finally {
        // Cancel forked tasks
        if (receiveTask) {
            yield cancel(receiveTask);
        }
        if (sendTask) {
            yield cancel(sendTask);
        }
        // Check if cancel is user initiated
        // @ts-expect-error
        if (yield cancelled()) {
            // close the channel
            if (socketChannel !== undefined) {

                socketChannel.close();
            }
        } else {
            yield put({
                type: WEBSOCKET_DISCONNECTED_WITH_ERROR
            });
        }
    }
}

export function* connect(socket: WebSocket) {
    // starts the task in the background
    const socketTask : Task = yield fork(prepareSocket, socket);

    // when DISCONNECT action is dispatched, we cancel the socket task
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
    yield put({
        type: WEBSOCKET_DISCONNECTED_NORMALLY
    });
}