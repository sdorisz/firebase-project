import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./App.scss";
import Admin from "./Admin";
import RegisterForm from "./components/RegisterForm";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/users/new">
          <RegisterForm />
        </Route>
        <Route path="/">
          <Admin />
        </Route>
      </Switch>
    </Router>)
}

export default App
