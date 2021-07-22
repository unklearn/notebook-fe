import React from 'react';
import './App.css';
import 'bulma/css/bulma.css';
import { Notebook } from './modules/notebooks/components/Notebook';
import { AppNavBar } from './modules/shared/components/AppNavBar';

function App() {
  return (
    <div className="App container">
      <AppNavBar/>
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
