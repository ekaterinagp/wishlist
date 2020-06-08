import React, { useState } from "react";
import "../css/wishlist.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Error from "./Error";

const AddWish = (props) => {
  const [wish, setWish] = useState("");
  const [desc, setDesc] = useState("");

  const [error, setError] = useState("");

  const history = useHistory();

  const addNewList = async (e) => {
    console.log(localStorage.getItem("id"));

    e.preventDefault();
    try {
      console.log(wish, desc);
      setWish("");
      setDesc("");
      console.log(wish, desc);
      const id = localStorage.getItem("id");
      console.log(id);
      const enteredData = {
        wish,
        desc,
      };

      const addedDataRes = await axios.post(
        `http://localhost:9090/${id}/wish/add`,
        enteredData
      );
      console.log({ addedDataRes });
      if (addedDataRes.data.res) {
        console.log(addedDataRes.data.res);
        setError(addedDataRes.data.res);
      }
      // props.parentMethod();
    } catch (error) {
      // error.addedDataRes.data.response &&
      //   setError(error.addedDataRes.data.response);
      console.log("here should go", error.addedDataRes.data.response);
    }
  };

  return (
    <div>
      <form onSubmit={addNewList} className="form-style-6">
        {error && <Error error={error} clearError={() => setError("")} />}
        <input
          type="text"
          value={wish}
          id="wish"
          placeholder="Wish"
          onChange={(e) => setWish(e.target.value)}
        />
        <input
          type="text"
          value={desc}
          id="desc"
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />

        <button className="example_b">Add your Wish</button>
      </form>
    </div>
  );
};
export default AddWish;
