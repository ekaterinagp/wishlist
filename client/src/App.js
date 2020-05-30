import React, { useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Upload from "./components/Upload";

import "./App.css";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div className="container mt-4">
          <Upload />
        </div>
        {/* <Header />
        <div className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/register" component={} />
            <Route path="/login" component={} />

            <Route path="/sendMail" component={} />
            <Route exact path="/list/:listId" component={} />
            <Route path="/resetPassword" component={} />
          </Switch>
        </div> */}
      </BrowserRouter>
    </>
  );
}
