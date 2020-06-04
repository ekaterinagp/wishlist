import React, { useEffect, useState } from "react";
import "../css/profile.css";
import { useHistory, Link } from "react-router-dom";
import AddComment from "./AddComment";
import axios from "axios";
import Header from "./Header";
import UploadFirebase from "./UploadFirebase";
import ResetPassword from "./ResetPassword";
import AddWish from "./AddWish";
import Notification from "./Notification";

export default function UserWishlist() {
  const history = useHistory();
  const [showText, setShowText] = useState(false);
  const [currentOpenState, setCurrentOpenState] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const resetPassword = () => history.push("/resetPassword");
  const [wishlist, setWishList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notAuth, setNotAuth] = useState(false);
  const [followers, setFollowers] = useState({});
  const [notification, setNotification] = useState({
    msg: "",
    id: "",
  });
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });
  const [init, setInit] = useState(true);

  let userId = localStorage.getItem("id");

  const fetchDetailsCommentsWishes = async () => {
    setInit(false);
    console.log("called from child");
    const res = await axios
      .get(`http://localhost:9090/list/${userId}`)
      .catch((error) => console.log(error));

    console.log(res.data);

    if (res.data.wishes) {
      if (init) {
        res.data.wishes.forEach((one) => {
          one.commentsAreOpen = false;
        });
      } else {
        wishlist.forEach((wish) => {
          let found = res.data.wishes.find((one) => one.id === wish.id);
          found.commentsAreOpen = wish.commentsAreOpen;
        });
      }

      setWishList(res.data.wishes);
    }
    setUserData({
      name: res.data.name,
      lastName: res.data.lastName,
      email: res.data.email,
    });
    setInit(false);
    setLoading(false);
  };

  const fetchUserDetails = async () => {
    const res = await axios
      .get(`http://localhost:9090/user/${userId}`)
      .catch((error) => console.log(error));

    console.log(res.data);

    setUserData({
      name: res.data.firstName,
      lastName: res.data.lastName,
      email: res.data.email,
    });

    setLoading(false);
  };

  const fetchFollowers = async () => {
    setLoading(true);
    const res = await axios
      .get(`http://localhost:9090/followers/${userId}`)
      .catch((error) => console.log(error));
    console.log(res.data);
    setFollowers(res.data);
    setLoading(false);
  };

  const confirmDelete = (e) => {
    resetState();
    const id = e.target.id;
    console.log(id);
    setNotification({
      msg: "Are you sure you want to delete this wish?",
      id: id,
    });
    console.log(notification);
  };

  const deleteWish = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios
      .delete(`http://localhost:9090/deletewish/${id}`, token)
      .catch((error) => console.log(error));

    console.log(res);
    window.location.reload(false);
  };

  const deleteComment = async (id) => {
    const token = localStorage.getItem("token");
    const res = await axios
      .delete(`http://localhost:9090/deletecomment/${id}`, token)
      .catch((error) => console.log(error));
    console.log(res);
    fetchDetailsCommentsWishes();
  };

  const resetState = () => {
    setNotification({
      msg: "",
      id: "",
    });
    window.location.reload(false);
  };

  const toggleComments = (id) => {
    console.log("opencomments", id);
    console.log(wishlist);
    wishlist.forEach((one) => {
      if (one.id == id) {
        console.log(one);
        one.commentsAreOpen = !one.commentsAreOpen;
      }
    });

    setWishList([...wishlist]);
    // setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (localStorage.getItem("id")) {
      fetchUserDetails();
      fetchFollowers();
    } else {
      setNotAuth(true);
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("id")) {
      fetchDetailsCommentsWishes();
    } else {
      setNotAuth(true);
    }
    console.log(notification);
  }, []);

  return (
    <>
      {notAuth ? (
        <p>You should log in to see list</p>
      ) : (
        <>
          <Header />

          <div className="height">
            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <div className="user-profile">
                <div className="profile">
                  {userData !== null ? (
                    <div className="user-details">
                      <h2>
                        {userData.name} {userData.lastName}
                      </h2>
                      <h3>{userData.email}</h3>

                      <Link to="/resetPassword" onClick={resetPassword}>
                        Reset password
                      </Link>
                      <div className="user-data">
                        {followers != {} ? (
                          <>
                            <div className="followers">
                              <p>Following </p>
                              <p className="follow-number">
                                {followers.follows.length}
                              </p>
                            </div>
                            <div className="followers">
                              <p>Followers </p>
                              <p className="follow-number">
                                {followers.followers.length}
                              </p>
                            </div>{" "}
                          </>
                        ) : (
                          <>
                            <div className="followers">
                              <p>Following </p>
                              <p className="follow-number">0</p>
                            </div>
                            <div className="followers">
                              <p>Followers </p>
                              <p className="follow-number">0</p>
                            </div>{" "}
                          </>
                        )}

                        <div className="followers">
                          <p>Wishes </p>
                          <p className="follow-number">
                            {!wishlist ? "0" : wishlist.length}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p> Please log in </p>
                  )}
                </div>
                {console.log(wishlist)}
                {notification.msg ? (
                  <Notification
                    msg={notification.msg}
                    id={notification.id}
                    parentMethod={deleteWish}
                    resetState={resetState}
                  />
                ) : null}
                {wishlist.length ? (
                  <div className="user-wishes">
                    {wishlist.map(
                      ({
                        id,
                        wish,
                        desc,
                        comments,
                        imgURL,
                        commentsAreOpen,
                      }) => (
                        <div className="article" key={`random-${desc}`}>
                          <div className="top-div-wish">
                            {" "}
                            <p
                              id={id}
                              className="delete-btn"
                              onClick={confirmDelete}
                            >
                              &#10006;
                            </p>
                            <h2 className="list-title">{wish}</h2>
                            <p className="description">{desc}</p>
                            <div id={id}>
                              <UploadFirebase
                                wishID={id}
                                img={imgURL}
                                parentMethod={fetchDetailsCommentsWishes}
                              />
                            </div>
                          </div>
                          <button
                            id={id}
                            className="example_b toggle"
                            onClick={() => toggleComments(id)}
                          >
                            Comments
                          </button>
                          {console.log("comments are open?", commentsAreOpen)}
                          <div
                            className="containerToggle"
                            id={id}
                            style={{
                              display: commentsAreOpen ? "block" : "none",
                            }}
                          >
                            <div className="middle-div-comments">
                              {console.log(comments)}
                              {comments.map(
                                ({
                                  text,
                                  created,
                                  firstName,
                                  lastName,
                                  id,
                                }) => {
                                  return (
                                    <div className="commentOne" key={text}>
                                      <p className="comment-author">
                                        {firstName} {lastName}
                                      </p>
                                      <p className="comment-text">{text}</p>

                                      <p className="comment-time">{created}</p>
                                      {console.log(id)}
                                      <p
                                        className="delete-comment"
                                        onClick={() => deleteComment(id)}
                                        id={id}
                                      >
                                        Delete comment
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                            <div className="bottom-div-add-comment">
                              <AddComment
                                listId={id}
                                parentMethod={fetchDetailsCommentsWishes}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    )}
                    <div className="article">
                      <AddWish parentMethod={fetchDetailsCommentsWishes} />
                    </div>
                  </div>
                ) : (
                  <div className="create-list">
                    <h2>Create your wish list</h2>
                    <div className="article">
                      <AddWish parentMethod={fetchDetailsCommentsWishes} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
