import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bulma/css/bulma.css';
import { Notebook } from './modules/notebooks/components/Notebook';

function App() {
  return (
    <div className="App container">
      <Notebook id="dummy" name="Dummy" runtimeConfigurations={[]}/>
    </div>
  );
}

export default App;
