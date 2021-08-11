import { IDisposable, ITerminalAddon, Terminal } from "xterm";

type SendFunction = (
  id: string,
  data: string | ArrayBuffer | ArrayBufferLike
) => void;

export class TerminalSocketAddon implements ITerminalAddon {
  private registry: Record<string, Function[]>;
  private id: string;
  private _disposables: IDisposable[] = [];
  private terminal?: Terminal;
  private send: SendFunction;

  constructor(
    registry: Record<string, Function[]>,
    id: string,
    send: SendFunction
  ) {
    this.registry = registry;
    this.id = id;
    this.terminal = undefined;
    this.send = send;
    this.handleSocketCallback = this.handleSocketCallback.bind(this);
  }

  activate(terminal: Terminal): void {
    this.terminal = terminal;
    // Add a socket listener which writes to terminal
    this.registry[this.id] = [this.handleSocketCallback];
    this._disposables.push(terminal.onData((data) => this._sendData(data)));
    this._disposables.push(terminal.onBinary((data) => this._sendBinary(data)));
  }

  private _sendData(data: string): void {
    this.send(this.id, data);
  }

  private _sendBinary(data: string): void {
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
      buffer[i] = data.charCodeAt(i) & 255;
    }
    this.send(this.id, buffer);
  }

  dispose(): void {
    this.registry[this.id] = [];
    for (const d of this._disposables) {
      d.dispose();
    }
    this.terminal = undefined;
  }
  handleSocketCallback(data: ArrayBuffer) {
    if (this.terminal) {
      this.terminal.write(new Uint8Array(data));
    }
  }
}
