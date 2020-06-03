import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import Header from "./Header";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import "../css/home.css";

import ListContainer from "./ListContainer";
// import AddList from "./AddList";

export default function Home() {
  const history = useHistory();
  const profile = () => history.push("/wishlist");
  let loggedIn = localStorage.getItem("id");
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });
  const userID = localStorage.getItem("id");
  const [loading, setLoading] = useState(true);
  const [follows, setFollows] = useState();

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

  const fetchFollows = async (e) => {
    const userId = localStorage.getItem("id");
    const res = await axios.get(`http://localhost:9090/followers/${userId}`);
    console.log(res.data);
    const followsArray = [];
    res.data.forEach((one) => {
      followsArray.push(one.follows_id);
    });

    setFollows(followsArray);
  };

  useEffect(() => {
    fetchUser();
    fetchLists();
    fetchFollows();
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

              <button className="example_b float" onClick={profile}>
                Your wish list
              </button>

              {/* <AddList parentMethod={fetchLists} /> */}
            </>
          ) : (
            <h3>Please log in to add your list and read comments</h3>
          )}
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <div className="articleContainer">
              {console.log(wishes)}
              {console.log(follows)}
              {wishes
                .filter((wish) => wish.id != userID)
                // .filter((wish) => wish.id == follows)
                .map(({ id, first_name, last_name, wishes }) => (
                  <div className="article-home" key={`random-${id}`}>
                    <div>
                      <h2 className="list-title">
                        {first_name} {last_name}
                      </h2>
                    </div>
                    <div className="wishes-middle">
                      {wishes.length ? (
                        wishes.map(({ wish, desc, id }) => {
                          return (
                            <div className="wishOne" key={id}>
                              <p className="wish-title">{wish}</p>
                              <p className="wish-desc">{desc}</p>
                            </div>
                          );
                        })
                      ) : (
                        <p className="no-wishes">No wishes yet</p>
                      )}
                    </div>
                    <div className="button-read">
                      {loggedIn ? (
                        <Link to={`/list/${id}`}>
                          <button className="example_b" align="center" id={id}>
                            Read more
                          </button>
                        </Link>
                      ) : (
                        <h5>Please log in to read/add comments</h5>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
