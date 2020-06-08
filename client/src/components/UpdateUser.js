import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Error from "./Error";
import "../css/profile.css";

const UpdateUser = (props) => {
  console.log("from update", props);
  const [email, setEmail] = useState(props.userData.email);
  const [firstName, setFirstName] = useState(props.userData.name);
  const [lastName, setLastName] = useState(props.userData.lastName);
  const [error, setError] = useState("");

  const history = useHistory();

  const handelChange = (event) => {
    console.log(event.target.value);
    console.log(event.target.id);
    if (event.target.id == "firstName") {
      setFirstName(event.target.value);
      console.log(firstName);
    }
    if (event.target.id == "lastName") {
      setLastName(event.target.value);
      console.log(lastName);
    }
    if (event.target.id == "email") {
      setEmail(event.target.value);
      console.log(email);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem("id");
      const credentials = { firstName, lastName, email };
      const updateUserData = await axios.put(
        `http://localhost:9090/edit/${id}/settings`,
        credentials
      );
      console.log(updateUserData);
      history.push("/wishlist");
      props.fetchHandler();
      props.open(false);
    } catch (error) {
      error.response.data.message && setError(error.response.data.message);
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={updateUser} id="update_form" className="form-style-6">
          {error && <Error error={error} clearError={() => setError("")} />}
          <input
            type="text"
            id="firstName"
            placeholder="First Name"
            value={firstName}
            // onChange={(e) => setFirstName(e.target.value)
            // }
            onChange={handelChange}
          />

          <input
            type="text"
            id="lastName"
            placeholder="Last Name"
            value={lastName}
            onChange={handelChange}
          />
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={handelChange}
          />

          <button className="example_b reset">Save settings</button>
        </form>
      </div>
    </>
  );
};

export default UpdateUser;
