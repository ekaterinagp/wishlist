import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Error from "./Error";
import "../css/profile.css";

const UpdateDetails = (props) => {
  console.log("from update", props);
  const [color, setColor] = useState(props.userData.color);
  const [size, setSize] = useState(props.userData.size);
  const [shop, setShop] = useState(props.userData.shop);
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState("");

  const history = useHistory();

  const handelChange = (event) => {
    console.log(event.target.value);
    console.log(event.target.id);
    if (event.target.id == "color") {
      setColor(event.target.value);
      console.log(color);
    }
    if (event.target.id == "size") {
      setSize(event.target.value);
      console.log(size);
    }
    if (event.target.id == "shop") {
      setShop(event.target.value);
      console.log(shop);
    }
  };

  const updateDetails = async (e) => {
    e.preventDefault();
    try {
      const id = localStorage.getItem("id");
      const details = { color, size, shop };
      const updateUserData = await axios
        .put(`http://localhost:9090/edit/${id}/preferences`, details)
        .catch((error) => console.log(error));
      console.log(updateUserData);
      if (updateUserData.data.message) {
        setError(updateUserData.data.message);
      } else {
        history.push("/wishlist");
        props.fetchHandler();
        props.open(false);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={updateDetails}
          id="details_update"
          className="form-style-6"
        >
          {error && <Error error={error} clearError={() => setError("")} />}
          <input
            type="text"
            id="color"
            placeholder="Color"
            value={color}
            onChange={handelChange}
          />

          <input
            type="text"
            id="size"
            placeholder="Size"
            value={size}
            onChange={handelChange}
          />
          <input
            type="text"
            id="shop"
            placeholder="Shop"
            value={shop}
            onChange={handelChange}
          />

          <button className="example_b reset">Save preferences</button>
        </form>
      </div>
    </>
  );
};

export default UpdateDetails;
