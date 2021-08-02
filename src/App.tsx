import React, { useState, useEffect } from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import 'xterm/css/xterm.css';
import { Notebook } from './modules/notebooks/components/Notebook';
import { AppNavBar } from './modules/shared/components/AppNavBar';
import { WebSocketMultiplex } from './modules/connection/WebsocketMultiplex';

function App() {
  const id = 'xt4wxc';
  const [mxws, setMxWs] = useState<WebSocketMultiplex | undefined>(undefined);
  useEffect(() => {
    const ws =  new WebSocket(`ws://localhost:8080/websocket/${id}`);
    const mxws = new WebSocketMultiplex(ws, () => {
      setMxWs(mxws);
    });
  }, []);
  return (
    <div className="App container">
      <AppNavBar/>
      <div id="terminal"></div>
      <Notebook id={id} name="Dummy" containerConfigurations={[]} socket={mxws}/>
    </div>
  );
}

export default App;
