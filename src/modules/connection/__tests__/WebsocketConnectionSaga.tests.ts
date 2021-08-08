import {
  take,
  put,
  all,
  call,
  fork,
  cancel,
  cancelled,
} from "redux-saga/effects";
import { createMockTask, cloneableGenerator } from "@redux-saga/testing-utils";
import { channel } from "redux-saga";
import createSocketChannel from "../WebsocketEventChannel";
import * as ActionTypes from "../WebsocketActions";
import {
  receiveMessages,
  sendMessage,
  prepareSocket,
  SocketChannel,
} from "../WebsocketConnectionSaga";
import { socketDemuxer, socketMuxer } from "../WebsocketMultiplex";

describe("WebsocketListenerSaga", () => {
  describe("receiveMessages", () => {
    test("puts message when socket event is dispatched", () => {
      const c = channel();
      // @ts-expect-error
      const gen = receiveMessages(c);
      const action = { type: "event", payload: "foo" };
      expect(gen.next().value).toEqual(take(c));
      expect(gen.next(action).value).toEqual(put(action));
    });

    test("puts messages one after the other", () => {
      const c = channel();
      // @ts-expect-error
      const gen = receiveMessages(c);
      let action = { type: "event", payload: "foo" };
      expect(gen.next().value).toEqual(take(c));
      expect(gen.next(action).value).toEqual(put(action));
      action = { type: "event2", payload: "foo2" };
      expect(gen.next().value).toEqual(take(c));
      expect(gen.next(action).value).toEqual(put(action));
    });
  });

  describe("sendMessage", () => {
    let socket = {
      send: jest.fn(),
    };

    beforeEach(() => {
      socket.send = jest.fn();
    });

    test("sendMessage sends message via socket", () => {
      // @ts-expect-error
      const gen = sendMessage(socket);
      expect(gen.next().value).toEqual(
        take(ActionTypes.WEBSOCKET_CONNECTION_SUCCESS)
      );
      expect(gen.next().value).toEqual(
        take(ActionTypes.WEBSOCKET_SEND_MESSAGE)
      );
      expect(
        gen.next(
          ActionTypes.sendWebsocketMessageAction("chan", "event", "asds")
        ).value
      ).toEqual(
        call([socket, socket.send], socketMuxer("chan", "event", "asds"))
      );
    });

    test("sendMessage sends multiple messages via socket", () => {
      // @ts-expect-error
      const gen = sendMessage(socket);
      expect(gen.next().value).toEqual(
        take(ActionTypes.WEBSOCKET_CONNECTION_SUCCESS)
      );
      expect(gen.next().value).toEqual(
        take(ActionTypes.WEBSOCKET_SEND_MESSAGE)
      );
      let action = ActionTypes.sendWebsocketMessageAction(
        "chan",
        "event",
        "asds"
      );
      expect(gen.next(action).value).toEqual(
        call([socket, socket.send], socketMuxer("chan", "event", "asds"))
      );
      expect(gen.next().value).toEqual(
        take(ActionTypes.WEBSOCKET_SEND_MESSAGE)
      );
      expect(
        gen.next(
          ActionTypes.sendWebsocketMessageAction("chan2", "event2", "abcd")
        ).value
      ).toEqual(
        call([socket, socket.send], socketMuxer("chan2", "event2", "abcd"))
      );
      expect(gen.next().done).toEqual(false);
    });
  });

  describe("prepareSocket", () => {
    const socket = new WebSocket("ws://localhost:1234");

    test("calls create websocket channel", () => {
      // @ts-expect-error
      let gen = cloneableGenerator(prepareSocket)(socket);
      let socketChannel = call(createSocketChannel, socket, socketDemuxer);
      expect(gen.next().value).toEqual(socketChannel);

      // @ts-expect-error
      let rTask = fork(receiveMessages, socketChannel);
      expect(gen.next(socketChannel).value).toEqual(rTask);
      let sTask = fork(sendMessage, socket);
      expect(gen.next(rTask).value).toEqual(sTask);
      expect(gen.next(sTask).value).toEqual(
        take([
          ActionTypes.WEBSOCKET_CONNECTION_ERROR,
          ActionTypes.WEBSOCKET_DISCONNECTED_NORMALLY,
        ])
      );
    });
  });
});
