import { WEBSOCKET_ON_MESSAGE } from "./WebsocketActions";

export interface DemuxedPayload {
    channelId: string;
    eventName: string;
    data: ArrayBuffer;
};

/**
 * A decoder function takes a multiplexed websocket data stream and returns
 * channelId, eventName and data
 */
export type WebsocketMultiplexDecoder = (data: ArrayBuffer) => DemuxedPayload;

export interface WebsocketMessageAction {
    type: typeof WEBSOCKET_ON_MESSAGE,
    payload: DemuxedPayload
};