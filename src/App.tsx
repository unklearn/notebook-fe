import "bulma/css/bulma.css";
import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import "xterm/css/xterm.css";
import "./App.css";
import { NotebookPage } from "./modules/notebooks/pages/NotebookPage";
import { AppNavBar } from "./modules/shared/components/AppNavBar";

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavBar />
        <div className="container">
          <Route path="/notebooks/:notebookId" component={NotebookPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
