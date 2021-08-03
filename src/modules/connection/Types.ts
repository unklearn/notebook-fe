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