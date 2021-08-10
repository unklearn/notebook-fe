import { cloneableGenerator } from "@redux-saga/testing-utils";
import { channel } from "redux-saga";
import { call, fork, put, take } from "redux-saga/effects";
import { actionizeChannelEventType } from "../../channels/ChannelTypes";
import * as ActionTypes from "../WebsocketActions";
import {
  prepareSocket,
  receiveMessages,
  sendMessage,
} from "../WebsocketConnectionSaga";
import createSocketChannel from "../WebsocketEventChannel";
import { socketDemuxer, socketMuxer } from "../WebsocketMultiplex";

describe("WebsocketListenerSaga", () => {
  describe("receiveMessages", () => {
    test("puts message when socket event is dispatched", () => {
      const c = channel();
      // @ts-expect-error
      const gen = receiveMessages(c);
      const d = new ArrayBuffer(2);
      const action = {
        type: "event",
        payload: { channelId: "c", eventName: "e", data: d },
      };
      expect(gen.next().value).toEqual(take(c));
      expect(gen.next(action).value).toEqual(
        put({
          type: actionizeChannelEventType("e"),
          payload: {
            channelId: "c",
            data: d,
          },
        })
      );
    });

    test("puts messages one after the other", () => {
      const c = channel();
      // @ts-expect-error
      const gen = receiveMessages(c);
      const d = new ArrayBuffer(2);
      let action = {
        type: "event",
        payload: { channelId: "c", eventName: "e", data: d },
      };
      expect(gen.next().value).toEqual(take(c));
      expect(gen.next(action).value).toEqual(
        put({
          type: actionizeChannelEventType("e"),
          payload: {
            channelId: "c",
            data: d,
          },
        })
      );
      action = {
        type: "event",
        payload: { channelId: "c2", eventName: "e2", data: d },
      };
      expect(gen.next().value).toEqual(take(c));
      expect(gen.next(action).value).toEqual(
        put({
          type: actionizeChannelEventType("e2"),
          payload: {
            channelId: "c2",
            data: d,
          },
        })
      );
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
