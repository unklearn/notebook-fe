import { DemuxedPayload } from "./Types";

const encoder = new TextEncoder();

// From https://github.com/sockjs/websocket-multiplex/blob/master/multiplex_client.js
// class DumbEventTarget {
//     private listeners: Record<string, Function[]>;
//     constructor() {
//         this.listeners = {};
//     }

//     _ensure(type: string) {
//         if (!(type in this.listeners)) this.listeners[type] = [];
//     }

//     addEventListener(type: string, listener: Function) {
//         this._ensure(type);
//         this.listeners[type].push(listener);
//     };
//     emit(type: string, ...args: any[]) {
//         this._ensure(type);
//         // Sometimes users can use ws.onopen = ...
//         // @ts-expect-error
//         if (this['on' + type]) {
//             // @ts-expect-error
//             this['on' + type].apply(this, args);
//         }
//         for (var i = 0; i < this.listeners[type].length; i++) {
//             this.listeners[type][i].apply(this, args);
//         }
//     };
// }

// export class MxedChannel extends DumbEventTarget {
//     private ws: WebSocket;
//     private name: string;
//     private nameBuf: Uint8Array;
//     private channels: Record<string, MxedChannel>;
//     // private readyState : number;

//     get readyState() {
//         return this.ws.readyState;
//     }

//     constructor(ws: WebSocket, name: string, channels: Record<string, MxedChannel>) {
//         super();
//         this.ws = ws;
//         this.name = name;
//         this.nameBuf = new TextEncoder().encode(name);
//         this.channels = channels;

//         var onopen = () => {
//             this.emit('open');
//         };
//         if (ws.readyState > 0) {
//             setTimeout(onopen, 0);
//         } else {
//             this.ws.addEventListener('open', onopen);
//         }
//     }
//     send(eventName: string, data: any) {

//         this.ws.send(finalBuf);
//     };
//     close() {
//         this.ws.send('uns,' + this.name);
//         delete this.channels[this.name];
//         setTimeout(() => { this.emit('close', {}); }, 0);
//     };

// }

// export class WebSocketMultiplex {
//     private ws: WebSocket;
//     private channels: Record<string, MxedChannel>;
//     public onopen: (ws: WebSocket, event: any) => void;

//     constructor(ws: WebSocket, onopen?: (ws: WebSocket, event: any) => void) {
//         this.ws = ws;
//         this.channels = {};
//         this.onopen = onopen ? onopen : () => 1;
//         this.ws.onopen = (event) => {
//             if (this.onopen) {
//                 this.onopen(this.ws, event);
//             }
//         };
//     }

//     channel(name: string): MxedChannel {
//         this.channels[name] = new MxedChannel(this.ws, name, this.channels);
//         return this.channels[name];
//     }
// };

/**
 * Socket demuxer is a function that satisfies type: WebsocketMultiplexDecoder
 * @param buffer ArrayBuffer the buffer to demux
 * @returns DemuxedPayload containing data
 */
export function socketDemuxer(buffer: ArrayBuffer): DemuxedPayload {
  // Parse 4 first bytes as littleEndian
  const bufferLen = buffer.byteLength;
  const channelIdLength = Math.min(
    Math.min(new DataView(buffer, 0, 4).getUint32(0, true), 256),
    bufferLen
  );
  const eventNameLength = Math.min(
    Math.min(new DataView(buffer, 4, 8).getUint32(0, true), 256),
    bufferLen
  );
  // Parse channelId and eventName
  const channelId = new TextDecoder().decode(
    buffer.slice(8, 8 + channelIdLength)
  );
  const eventName = new TextDecoder().decode(
    buffer.slice(8 + channelIdLength, 8 + channelIdLength + eventNameLength)
  );

  return {
    channelId,
    eventName,
    data: buffer.slice(8 + channelIdLength + eventNameLength),
  };
}

export function socketMuxer(
  channelId: string,
  eventName: string,
  data: string | ArrayBuffer | ArrayBufferLike
): Uint8Array {
  // Create arraybuffer
  if (typeof data === "string") {
    data = encoder.encode(data).buffer;
  }
  //debugger
  // Create unsigned 32 view
  const lengthBuf = new Uint32Array(2);
  lengthBuf[0] = channelId.length;
  lengthBuf[1] = eventName.length;
  const nameBuf = new Uint8Array(channelId.length + eventName.length);
  const channelIdBuf = encoder.encode(channelId);
  nameBuf.set(channelIdBuf, 0);
  nameBuf.set(encoder.encode(eventName), channelIdBuf.byteLength);

  // Now we add remaining data as U8array with offset
  const finalBuf = new Uint8Array(
    lengthBuf.byteLength + nameBuf.byteLength + data.byteLength
  );
  finalBuf.set(new Uint8Array(lengthBuf.buffer), 0);
  finalBuf.set(nameBuf, lengthBuf.byteLength);
  finalBuf.set(new Uint8Array(data), lengthBuf.byteLength + nameBuf.byteLength);
  return finalBuf;
}
