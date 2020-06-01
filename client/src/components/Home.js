import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import Header from "./Header";
import "../css/home.css";

import ListContainer from "./ListContainer";
// import AddList from "./AddList";

export default function Home() {
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });
  const userID = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);

  const [wishes, setWishes] = useState([]);
  // const loading = userData.name == null;

  const fetchLists = async (e) => {
    setWishes([]);

    let res = await axios.get("http://localhost:9090/userswishes");
    console.log(res);

    if (res.data.length) {
      console.log(res.data);
      setWishes(res.data);
    }
    setLoading(false);
  };

  const fetchUser = async (e) => {
    const userId = localStorage.getItem("id");
    if (userId) {
      const res = await axios.get(`http://localhost:9090/user/${userId}`);

      console.log(res.data);

      if (res.data) {
        setUserData({
          name: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
        });
      }
      setLoading(false);
    }
  };

  function forEachWish(one) {
    console.log(one);
    return (
      <>
        <p>{one.wish}</p>
        <p>{one.desc}</p>
      </>
    );
  }

  useEffect(() => {
    fetchUser();
    fetchLists();
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
          <div className="articleContainer">
            {console.log(wishes)}
            {wishes
              .filter((wish) => wish.id != userID)
              .map(({ id, first_name, last_name, wishes }) => (
                <div className="article" key={`random-${id}`}>
                  <h2 className="list-title">
                    {first_name} {last_name}
                  </h2>

                  {wishes.map(({ wish, desc, id }) => {
                    return (
                      <div className="wishOne" key={id}>
                        <p className="wish-title">{wish}</p>
                        <p className="wish-desc">{desc}</p>
                      </div>
                    );
                  })}

                  {/* <div>
                  {console.log({ wishes })}
                  {wishes.forEach((wish) => {
                    console.log(wish);
                    forEachWish(wish);
                  })}
                </div> */}
                  {/* {loggedIn ? (
                  <Link to={`/list/${id}`}>
                    <button className="example_b" align="center" id={id}>
                      Add/Read comment
                    </button>
                  </Link>
                ) : (
                  <h5>Please log in to read/add comments</h5>
                )} */}
                </div>
              ))}
          </div>
        )}
      </div>
    </>
  );
}
