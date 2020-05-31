import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
// import Upload from "./components/Upload";
import Header from "./components/Header";
import StartPage from "./components/StartPage";
import axios from "axios";

import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const token = localStorage.getItem("auth-token");
  const checkUserLoggedIn = async () => {
    if (token) {
      const tokenRes = await axios.post(
        "http://localhost:9090/tokenIsValid",

        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setLoggedIn(true);
      console.log(tokenRes);
    } else {
      setLoggedIn(false);
    }
  };
  useEffect(() => {
    checkUserLoggedIn();
  }, []);
  return (
    <>
      <BrowserRouter>
        {/* <Header /> */}
        {/* {loggedIn ? <Home /> : <StartPage />} */}
        <Switch>
          <Route
            exact
            path="/"
            component={() => (loggedIn ? <Home /> : <StartPage />)}
          />

          <Route path="/home" component={Home} />
          {/* <Route path="/register" component={} /> */}
          <Route path="/login" component={Login} />

          {/* <Route path="/sendMail" component={} /> */}
          {/* <Route exact path="/list/:listId" component={} /> */}
          {/* <Route path="/resetPassword" component={} /> */}
        </Switch>
      </BrowserRouter>
    </>
  );
}
