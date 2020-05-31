import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import "../css/startPage.css";
import { BrowserRouter, Link } from "react-router-dom";

export default function StartPage() {
  return (
    <div className="start-container">
      <div className="top-part">
        {" "}
        <h1>Wish list</h1>
        <h4>Make sure you get only what you really want</h4>
      </div>
      <div className="login-part">
        <Login />
        <div className="not-registered">
          <p>Not registered? Sign up</p>{" "}
          <BrowserRouter>
            <Link to="/register">Sign up</Link>
          </BrowserRouter>
        </div>
      </div>
      <div className="advice-part"></div>
    </div>
  );
}
