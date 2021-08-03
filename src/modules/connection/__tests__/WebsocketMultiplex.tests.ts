import { socketDemuxer, socketMuxer } from "../WebsocketMultiplex";

test('socketDemuxer:eats characters upto end if length is incorrect', function() {
    const data = new Uint8Array([40, 40, 0, 0, 5, 0, 0, 0, 99, 104, 97, 110, 101, 118, 101, 110, 116, 97, 115, 100, 115]);
    const result = socketDemuxer(data.buffer);
    expect(result.channelId).toEqual('chaneventasds');
    expect(result.eventName).toEqual('');
    expect(result.data.byteLength).toEqual(0);
});


test('socketDemuxer:parses correctly if lengths are correct', function() {
    const data = new Uint8Array([4, 0, 0, 0, 5, 0, 0, 0, 99, 104, 97, 110, 101, 118, 101, 110, 116, 97, 115, 100, 115]);
    const result = socketDemuxer(data.buffer);
    expect(result.channelId).toEqual('chan');
    expect(result.eventName).toEqual('event');
    expect(result.data.byteLength).toEqual(4);
});

test('sockerMuxer:writes data correctly for strings', function() {
    const buf = socketMuxer('chan', 'event', 'asds');
    const data = new Uint8Array([4, 0, 0, 0, 5, 0, 0, 0, 99, 104, 97, 110, 101, 118, 101, 110, 116, 97, 115, 100, 115]);
    expect(buf).toEqual(data);
});

test('sockerMuxer:writes data correctly for bytes', function() {
    const buf = socketMuxer('chan', 'event', new TextEncoder().encode('asds').buffer);
    const data = new Uint8Array([4, 0, 0, 0, 5, 0, 0, 0, 99, 104, 97, 110, 101, 118, 101, 110, 116, 97, 115, 100, 115]);
    expect(buf).toEqual(data);
});
