import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Error from "./common/Error";

export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    token: "",
    user: "",
  });

  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const loginData = { email, password };
      const loginRes = await axios.post(
        "http://localhost:9090/login",
        loginData
      );

      setUser({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });

      localStorage.setItem("auth-token", loginRes.data.token);
      localStorage.setItem("id", loginRes.data.user.id);
      history.push("/home");
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  return (
    <div className="form-style-6">
      <h2 className="align">Log in</h2>
      {error && <Error error={error} clearError={() => setError("")} />}

      <form onSubmit={submit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          name="field1"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          name="field2"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" value="Log in" />
      </form>
    </div>
  );
}
