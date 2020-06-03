import React, { useEffect, useState } from "react";

import AddComment from "./AddComment";
import axios from "axios";
import Header from "./Header";
// import UploadFirebase from "./UploadFirebase";

export default function List({ match }) {
  let params = match.params;
  console.log(params);

  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [wishlist, setWishList] = useState();
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [notAuth, setNotAuth] = useState(false);

  const fetchDetailsCommentsWishes = async () => {
    const res = await axios.get(`http://localhost:9090/list/${params.listId}`);

    console.log(res);

    if (res.data.wishes) {
      setWishList(res.data.wishes);
    }
    setUserData({
      name: res.data.name,
      lastName: res.data.lastName,
      email: res.data.email,
    });

    setLoading(false);
  };
  const toggle = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (localStorage.getItem("id")) {
      fetchDetailsCommentsWishes();
    } else {
      setNotAuth(true);
    }
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
                    <div>
                      <h2 className="center">
                        Wish list for <br />
                        {userData.name} {userData.lastName}
                      </h2>
                      <h3 className="center">
                        <strong className="blue">Contact:</strong>{" "}
                        {userData.email}
                      </h3>
                    </div>
                  ) : (
                    <p> Please log in </p>
                  )}
                </div>
                <div className="">
                  {wishlist.length ? (
                    <div className="user-wishes">
                      {console.log(wishlist)}
                      {wishlist.map(({ id, wish, desc, comments, imgURL }) => (
                        <div className="article" key={`random-${desc}`}>
                          <div className="top-div-wish">
                            <h2 className="list-title">{wish}</h2>
                            <p className="description">{desc}</p>
                            <div id={id}>
                              {!imgURL ? (
                                <img
                                  className="wish-img"
                                  src="https://firebasestorage.googleapis.com/v0/b/wishlist-8b07c.appspot.com/o/images%2Fdefault.jpg?alt=media"
                                ></img>
                              ) : (
                                <img
                                  className="wish-img"
                                  src={imgURL}
                                  alt="image tag"
                                />
                              )}
                            </div>
                          </div>
                          <button
                            id={id}
                            className="example_b toggle"
                            onClick={toggle}
                          >
                            Comments
                          </button>

                          <div
                            className="containerToggle"
                            id={id}
                            style={{ display: isOpen ? "block" : "none" }}
                          >
                            <div className="middle-div-comments">
                              {comments.map(
                                ({ text, created, firstName, lastName }) => {
                                  return (
                                    <div className="commentOne" key={text}>
                                      <p className="comment-author">
                                        {firstName} {lastName}
                                      </p>
                                      <p className="comment-text">{text}</p>

                                      <p className="comment-time">{created}</p>
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
                      ))}
                    </div>
                  ) : (
                    <h2>Create your wish list</h2>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
