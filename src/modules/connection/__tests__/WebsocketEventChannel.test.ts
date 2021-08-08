// @ts-nocheck
import { END } from "redux-saga";
import createSocketEventChannel from "../WebsocketEventChannel";
import { socketDemuxer } from "../WebsocketMultiplex";
import { WEBSOCKET_ON_MESSAGE } from "../WebsocketActions";

describe("WebsocketEventChannel", () => {
  const socket = {
    cb: {},
    addEventListener: (message, fn) => {
      socket.cb[message] = fn;
    },
    close: jest.fn(),
  };

  test("it parse and emit parsed message", (done) => {
    const channel = createSocketEventChannel(socket, socketDemuxer);
    channel.take((payload) => {
      expect(payload).toEqual({
        payload: {
          channelId: "chan",
          data: new TextEncoder().encode("asds").buffer,
          eventName: "event",
        },
        type: WEBSOCKET_ON_MESSAGE,
      });
      done();
    });
    socket.cb["message"]({
      data: new Uint8Array([
        4, 0, 0, 0, 5, 0, 0, 0, 99, 104, 97, 110, 101, 118, 101, 110, 116, 97,
        115, 100, 115,
      ]).buffer,
    });
  });

  test("it should register a disconnection method that emits END event", (done) => {
    const channel = createSocketEventChannel(socket, socketDemuxer);
    channel.take((payload) => {
      expect(payload).toEqual(END);
      expect(socket.close).toBeCalled();
      done();
    });
    socket.cb["close"]();
  });
});
