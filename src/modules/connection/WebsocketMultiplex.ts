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

class Channel extends DumbEventTarget {
    private ws : WebSocket;
    private name: string;
    private channels: Record<string, Channel>;
    private readyState : number;

    constructor(ws: WebSocket, name: string, channels : Record<string, Channel>) {
        super();
        this.ws = ws;
        this.name = name;
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
    send(data: any) {
        console.log('sending', data);
        this.ws.send(this.name + '::' + data);
    };
    close() {
        this.ws.send('uns,' + this.name);
        delete this.channels[this.name];
        setTimeout(() => {this.emit('close', {});},0);
    };

}

export class WebSocketMultiplex {
    private ws : WebSocket;
    private channels: Record<string, Channel>;


    constructor(ws: WebSocket) {
        this.ws = ws;
        this.channels = {};
        this.ws.addEventListener('message', async (e) => {
            // Slice and read channel identifiers until a specific byte sequence is found
            const b: Blob = e.data;
            let soFar = "";
            let offset = 0;
            const size = b.size;
            let channelName;
            while (offset < size) {
                soFar += await b.slice(offset, offset + 4).text();
                channelName = this._parseChannel(soFar);
                if (channelName) {
                    break
                }
                offset += 4;
            }
            if (channelName) {
                // Send message to channel
                const ch = this.channels[channelName];
                if (ch) {
                    const rest = await b.slice(channelName.length + 2, size).arrayBuffer();
                    ch.emit('message', {
                        data: rest
                    });
                }
            } else {
                console.warn('message received on unknown channel', channelName);
            }
        });
    }

    _parseChannel(s : string) {
        let i = s.indexOf('::');
        if (i === -1) {
            return undefined;
        }
        return s.slice(0, i);
    }

    channel(name: string) : Channel {
        this.channels[name]  = new Channel(this.ws, name, this.channels);
        return this.channels[name];
    }
};