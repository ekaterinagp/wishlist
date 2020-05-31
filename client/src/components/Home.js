import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import Header from "./Header";

// import Lists from "./Lists";
// import AddList from "./AddList";

export default function Home() {
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);

  const [lists, setWishes] = useState([]);
  // const loading = userData.name == null;

  const fetchLists = async (e) => {
    setWishes([]);

    let res = await axios.get("http://localhost:9090/wishes");
    console.log(res.data);
    // setLoading2(false);
    // if (res.data.response.length) {
    //   setLists({
    //     lists: res.data.response.reverse(),
    //   });
    // }
  };

  const fetchUser = async (e) => {
    const userId = localStorage.getItem("id");
    if (userId) {
      const res = await axios.get(`http://localhost:9090/user/${userId}`);

      console.log(res.data[0]);

      if (res.data[0]) {
        setUserData({
          name: res.data[0].first_name,
          lastName: res.data[0].last_name,
          email: res.data[0].email,
        });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // fetchLists();
  }, []);

  return (
    <>
      <Header />
      <div className="page">
        <div className="welcome">
          {userData.name ? (
            <>
              <h2 className="welcome-title">
                Welcome <br></br> {userData.name} {userData.lastName}
              </h2>
              {/* <AddList parentMethod={fetchLists} /> */}
            </>
          ) : (
            <h3>Please log in to add your list and read comments</h3>
          )}
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          // <Lists lists={lists} />
          <p>wishes go here</p>
        )}
      </div>
    </>
  );
}
