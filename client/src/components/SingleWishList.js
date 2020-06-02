import React, { useEffect, useState } from "react";

import AddComment from "./AddComment";
import axios from "axios";
import Header from "./Header";

export default function List({ match }) {
  let params = match.params;
  console.log(params);
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
                {console.log(wishlist)}
                {wishlist.length ? (
                  <div className="user-wishes">
                    {wishlist.map(({ id, wish, desc, comments }) => (
                      <div className="article" key={`random-${id}`}>
                        <h2 className="list-title">{wish}</h2>
                        <p>{desc}</p>

                        {comments.length ? (
                          comments.map(
                            ({ text, id, firstName, lastName, created }) => {
                              return (
                                <div className="commentOne" key={id}>
                                  <p className="comment-text">{text}</p>
                                  <p className="comment-author">
                                    {firstName} {lastName}
                                  </p>
                                  <p className="comment-time">{created}</p>
                                </div>
                              );
                            }
                          )
                        ) : (
                          <p>No comments yet</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <h2>Create your wish list</h2>
                )}
                <AddComment
                  listId={params.listId}
                  parentMethod={fetchDetailsCommentsWishes}
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
