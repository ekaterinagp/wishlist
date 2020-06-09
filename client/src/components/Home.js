import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import Header from "./Header";
// import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";
import "../css/home.css";
// import Error from "../common/Error";

export default function Home() {
  const [error, setError] = useState("");
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
    // setLoading(false);
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
      // setLoading(false);
    }
  };

  const fetchFollows = async (e) => {
    setLoading(true);
    const userId = localStorage.getItem("id");
    const res = await axios.get(`http://localhost:9090/followers/${userId}`);
    console.log(res.data.follows);

    setFollows(res.data.follows);
    setLoading(false);
    console.log(follows);
  };

  const handelClickFollow = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    addToFollow(e.target.id);
  };

  const addToFollow = async (id) => {
    try {
      const data = {
        follower_id: id,
        user_id: localStorage.getItem("id"),
      };

      const addedDataRes = await axios
        .post(`http://localhost:9090/follow`, data)
        .catch((error) => console.log(error));
      console.log({ addedDataRes });

      fetchFollows();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchUser();
    fetchLists();
    fetchFollows();
    setLoading(false);
  }, []);

  return (
    <>
      <Header />
      <div className="page">
        <div className="welcome">
          {userData.name ? (
            <>
              <div className="welcome-top">
                <h2 className="welcome-title">
                  Welcome <br></br> {userData.name} {userData.lastName}
                </h2>

                <button className="example_b justify" onClick={profile}>
                  My wish list
                </button>
              </div>
            </>
          ) : (
            <h3 className="to-log-in">Please log in </h3>
          )}
        </div>
        {loading && !wishes.length ? (
          <p className="loading">Loading...</p>
        ) : (
          <>
            <div className="wrapper">
              <div className="top-wrapper">
                <h2 className="title-friends">Friends</h2>
                {follows == "" ? (
                  <p className="not-follow">You do not follow any lists yet</p>
                ) : null}
                <div className="articleContainer">
                  {console.log(wishes)}
                  {console.log("follows", follows)}
                  {wishes
                    .filter((wish) => wish.id != userID)
                    .filter((wish) =>
                      follows ? follows.includes(wish.id) : null
                    )
                    .map(({ id, first_name, last_name, wishes }) => (
                      <div className="article-home card-1" key={`random-${id}`}>
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
                              <button
                                className="example_b"
                                align="center"
                                id={id}
                              >
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
              </div>
              <div className="bottom-wrapper">
                <h2 className="title-friends">Add friends</h2>
                <div className="articleContainer">
                  {console.log(wishes)}
                  {console.log("follows", follows)}
                  {wishes
                    .filter((wish) => wish.id != userID)
                    .filter((wish) =>
                      follows ? !follows.includes(wish.id) : null
                    )
                    .map(({ id, first_name, last_name, wishes }) => (
                      <div className="article-home" key={`random-${id}`}>
                        <div>
                          <h2 className="list-title">
                            {first_name} {last_name}
                          </h2>
                        </div>

                        <p className="no-wishes">
                          You need to follow user to read lists and comments
                        </p>
                        <div className="div-follow">
                          <button
                            className="example_b"
                            id={id}
                            onClick={handelClickFollow}
                          >
                            Follow
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
