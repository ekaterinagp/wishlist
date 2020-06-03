import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import "../css/startPage.css";
import { useHistory, BrowserRouter, Link } from "react-router-dom";

export default function StartPage() {
  const history = useHistory();
  const register = () => history.push("/register");
  const [advice, setAdvice] = useState();
  const [loading, setLoading] = useState(true);
  const getAdvice = async () => {
    const res = await axios.get("https://api.adviceslip.com/advice");
    console.log(res.data.slip.advice);
    setAdvice(res.data.slip.advice);
    setLoading(false);
  };

  useEffect(() => {
    getAdvice();
    const interval = setInterval(() => {
      getAdvice();
    }, 10000);
    return () => clearInterval(interval);
  }, []);
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
            <Link to="/register" onClick={register}>
              Sign up
            </Link>
          </BrowserRouter>
        </div>
      </div>
      <div className="advice-part">
        <h3>Advice of the day</h3>
        <h2>{advice}</h2>
      </div>
    </div>
  );
}
