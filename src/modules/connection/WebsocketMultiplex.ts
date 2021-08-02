// From https://github.com/sockjs/websocket-multiplex/blob/master/multiplex_client.js
class DumbEventTarget {
    private listeners: Record<string, Function[]>;
    constructor() {
        this.listeners = {};
    }

    _ensure(type: string) {
        if(!(type in this.listeners)) this.listeners[type] = [];
    }

    addEventListener(type: string, listener: Function) {
        this._ensure(type);
        this.listeners[type].push(listener);
    };
    emit(type: string, ...args: any[]) {
        this._ensure(type);
        // Sometimes users can use ws.onopen = ...
        // @ts-expect-error
        if (this['on' + type]) {
            // @ts-expect-error
            this['on' + type].apply(this, args);
        }
        for(var i=0; i < this.listeners[type].length; i++) {
            this.listeners[type][i].apply(this, args);
        }
    };
}

export class MxedChannel extends DumbEventTarget {
    private ws : WebSocket;
    private name: string;
    private nameBuf: Uint8Array;
    private channels: Record<string, MxedChannel>;
    private readyState : number;

    constructor(ws: WebSocket, name: string, channels : Record<string, MxedChannel>) {
        super();
        this.ws = ws;
        this.name = name;
        this.nameBuf = new TextEncoder().encode(name);
        this.channels = channels;
        this.readyState = 1;

        var onopen = () => {
            this.emit('open');
        };
        if(ws.readyState > 0) {
            setTimeout(onopen, 0);
        } else {
            this.ws.addEventListener('open', onopen);
        }
    }
    send(eventName:string, data: any) {
        function str2ab(str: string) : ArrayBuffer {
            var buf = new ArrayBuffer(str.length);
            var bufView = new Uint8Array(buf);
            for (var i=0, strLen=str.length; i<strLen; i++) {
              bufView[i] = str.charCodeAt(i);
            }
            return buf;
          }
        function strtouint8(bufferString: string) : Uint8Array {
            return new TextEncoder().encode(bufferString);
        }
        // Create arraybuffer
        if (data instanceof Blob) {
            data = data.arrayBuffer()
        } else if (typeof data === "string") {
            data = str2ab(data);
        } else if (!(data instanceof ArrayBuffer)) {
            throw new Error('Data must be one of string, Blob or ArrayBuffer');
        }
        //debugger
        // Create unsigned 32 view
        const lengthBuf = new Uint32Array(2);
        lengthBuf[0] = this.name.length;
        lengthBuf[1] = eventName.length;
        const nameBuf = new Uint8Array(this.name.length + eventName.length);
        nameBuf.set(this.nameBuf, 0);
        nameBuf.set(strtouint8(eventName), this.nameBuf.byteLength);
        
        // Now we add remaining data as U8array with offset
        const finalBuf = new Uint8Array(lengthBuf.byteLength + nameBuf.byteLength + data.byteLength);
        finalBuf.set(new Uint8Array(lengthBuf.buffer), 0);
        finalBuf.set(nameBuf, lengthBuf.byteLength);
        finalBuf.set(new Uint8Array(data), lengthBuf.byteLength + nameBuf.byteLength);
        this.ws.send(finalBuf);
    };
    close() {
        this.ws.send('uns,' + this.name);
        delete this.channels[this.name];
        setTimeout(() => {this.emit('close', {});},0);
    };

}

export class WebSocketMultiplex {
    private ws : WebSocket;
    private channels: Record<string, MxedChannel>;
    public onopen : (ws: WebSocket, event: any) => void;


    constructor(ws: WebSocket, onopen?: (ws: WebSocket, event: any) => void) {
        this.ws = ws;
        this.channels = {};
        this.onopen = onopen ? onopen : () => 1;
        this.ws.onopen = (event) => {
            if (this.onopen) {
                this.onopen(this.ws, event);
            }
        };
        this.ws.addEventListener('message', async (e) => {
            // Slice and read channel identifiers until a specific byte sequence is found
            const b: Blob = e.data;
            let { element: channelName, rest } = await this._parseElement(b);
            if (channelName) {
                // Send message to channel
                const ch = this.channels[channelName];
                if (ch) {
                    if (channelName === 'root') {
                        let { element: actionType, rest: nextRest } = await this._parseElement(rest);
                        if (actionType) {
                            const finalData = await nextRest.text();
                            ch.emit('message', {
                                type: actionType,
                                data: finalData
                            });
                        } else {
                            console.warn('Unknown action-type on root channel');
                        }
                    } else {
                        const finalData = await rest.arrayBuffer();
                        ch.emit('message', {
                            data: finalData
                        });
                    }
                }
            } else {
                console.warn('message received on unknown channel', channelName);
            }
        });
    }

    async _parseElement(b: Blob, delimter='::') : Promise<{element: string, rest: Blob}> {
        let soFar = "";
        let element = "";
        let offset = 0;
        let size = b.size;
        while (offset < size) {
            soFar += await b.slice(offset, offset + 4).text();
            let i = soFar.indexOf(delimter);
            if (i !== -1) {
                element = soFar.slice(0, i);
            }
            if (element) {
                break
            }
            offset += 4;
        }
        if (element && element.length) {
            const rest = await b.slice(element.length + delimter.length, size);
            return {
                element,
                rest
            };
        }
        return {
            element,
            rest: b
        };
    }

    channel(name: string) : MxedChannel {
        console.log("Adding channel", name);
        this.channels[name]  = new MxedChannel(this.ws, name, this.channels);
        return this.channels[name];
    }
};