import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Error from "./Error";

export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [firstName, setfirstName] = useState();
  const [lastName, setlastName] = useState();
  const [error, setError] = useState("");
  const [user, setUserData] = useState({
    id: "",
    token: "",
  });

  const history = useHistory();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { email, password, passwordCheck, firstName, lastName };
      await axios.post("http://localhost:9090/register", newUser);
      const loginRes = await axios.post("http://localhost:9090/login", {
        email,
        password,
      });
      setUserData({
        token: loginRes.data.token,
        id: loginRes.data.user,
      });
      console.log(user);
      localStorage.setItem("auth-token", loginRes.data.token);
      localStorage.setItem("id", loginRes.data.user.id);
      history.push("/");
    } catch (error) {
      error.response.data.msg && setError(error.response.data.msg);
    }
  };
  return (
    <div className="page-form">
      {error && <Error error={error} clearError={() => setError("")} />}
      <form className="form-style-6" onSubmit={submit}>
        <h2 className="align">Register</h2>
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="register-firstName">First Name</label>
        <input
          id="register-firstName"
          type="text"
          placeholder="First name"
          onChange={(e) => setfirstName(e.target.value)}
        />
        <label htmlFor="register-lastName">Last Name</label>
        <input
          id="register-lastName"
          type="text"
          placeholder="Last name"
          onChange={(e) => setlastName(e.target.value)}
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="register-password">Repeat password</label>
        <input
          type="password"
          placeholder="Repeat password"
          onChange={(e) => setPasswordCheck(e.target.value)}
        />

        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
