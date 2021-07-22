import React, { useEffect } from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import 'xterm/css/xterm.css';
import { Notebook } from './modules/notebooks/components/Notebook';
import { AppNavBar } from './modules/shared/components/AppNavBar';
import { WebSocketMultiplex } from './modules/connection/WebsocketMultiplex';
import { Terminal } from 'xterm';
import { AttachAddon } from 'xterm-addon-attach';

function App() {
  useEffect(() => {
    const ws =  new WebSocket("ws://localhost:8080/websocket");
    const mxws = new WebSocketMultiplex(ws);
    const root = mxws.channel('root');
    const cont = mxws.channel('709c');
    setTimeout(() => {
    
    root.send(JSON.stringify({
      Action: "sync",
      ContainerId: "709c"
    }));
    cont.send(JSON.stringify({
      Action: "exec-command",
      Command: ["bash"]
    }));
    const terminal = new Terminal({convertEol: true});
    // @ts-expect-error
    const attachAddon = new AttachAddon(mxws.channel("709c-abcd"), { bidirectional: true});
    terminal.loadAddon(attachAddon);
    // @ts-expect-error
    terminal.open(document.getElementById('terminal'));
    }, 3000);
    console.log(mxws);
  }, []);
  return (
    <div className="App container">
      <AppNavBar/>
      <div id="terminal"></div>
      <Notebook id="dummy" name="Dummy" containerConfigurations={[{
        id: "abc",
        name: "deagon",
        image: "python",
        tag: "3.6",
        status: "pending",
        envVars: {}
      }, {
        id: "def",
        name: "psql",
        image: "postgres",
        tag: "12.0",
        status: "pending",
        envVars: {}
      }]}/>
    </div>
  );
}

export default App;
