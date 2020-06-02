import React, { useEffect, useState } from "react";
import "../css/profile.css";
import { useHistory, Link } from "react-router-dom";
import AddComment from "./AddComment";
import axios from "axios";
import Header from "./Header";
import UploadFirebase from "./UploadFirebase";
import ResetPassword from "./ResetPassword";

export default function UserWishlist() {
  const history = useHistory();
  const resetPassword = () => history.push("/resetPassword");
  const [wishlist, setWishList] = useState();
  const [loading, setLoading] = useState(true);
  const [notAuth, setNotAuth] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    lastName: "",
    email: "",
  });

  let userId = localStorage.getItem("id");
  const fetchDetailsCommentsWishes = async () => {
    const res = await axios
      .get(`http://localhost:9090/list/${userId}`)
      .catch((error) => console.log(error));

    console.log(res.data);

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
          <Link to="/resetPassword" onClick={resetPassword}>
            Reset password
          </Link>
          <div>
            {loading ? (
              <p className="loading">Loading...</p>
            ) : (
              <div className="user-profile">
                <div className="profile">
                  {userData !== null ? (
                    <div>
                      <h2>
                        {userData.name} {userData.lastName}
                      </h2>
                      <h3>{userData.email}</h3>
                    </div>
                  ) : (
                    <p> Please log in </p>
                  )}
                </div>
                {/* {console.log(wishlist)} */}
                {wishlist.length ? (
                  <div className="user-wishes">
                    {wishlist.map(({ id, wish, desc, comments, imgURL }) => (
                      <div className="article" key={`random-${desc}`}>
                        <div className="top-div-wish">
                          <h2 className="list-title">{wish}</h2>
                          <p className="description">{desc}</p>
                          <div id={id}>
                            <UploadFirebase wishID={id} img={imgURL} />
                          </div>
                        </div>
                        <div className="middle-div-comments">
                          {comments.map(
                            ({ text, created, firstName, lastName }) => {
                              return (
                                <div className="commentOne" key={text}>
                                  <p className="comment-text">{text}</p>
                                  <p className="comment-author">
                                    {firstName} {lastName}
                                  </p>
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
                    ))}
                  </div>
                ) : (
                  <h2>Create your wish list</h2>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
