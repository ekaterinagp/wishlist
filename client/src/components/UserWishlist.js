import React, { useEffect, useState } from "react";

// import AddComment from "./AddComment";
import axios from "axios";

export default function UserWishlist() {
  // let params = match.params;
  // console.log(params);
  const [wishlist, setWishList] = useState();
  const [loading, setLoading] = useState(true);
  const [notAuth, setNotAuth] = useState(false);

  // useEffect(() => console.log(data.title), [data.title]);

  const fetchAllwishes = async (e) => {
    let userId = localStorage.getItem("id");
    const res = await axios.get(`http://localhost:9090/list/${userId}`);

    console.log(res);
    if (res.data.length) {
      setWishList(res.data);
    }
    setLoading(false);
    // if (res.data.response.length) {
    //   setData({
    //     id: res.data.response.id,
    //     title: res.data.response[0].title,
    //     item_1: res.data.response[0].item_1,
    //     item_2: res.data.response[0].item_2,
    //     item_3: res.data.response[0].item_3,
    //     author:
    //       res.data.response[0].users.first_name +
    //       " " +
    //       res.data.response[0].users.last_name,
    //     comments: res.data.response[0].comments,
    //   });
    // }
  };
  useEffect(() => {
    if (localStorage.getItem("id")) {
      fetchAllwishes();
    } else {
      setNotAuth(true);
    }
  }, []);

  return (
    <>
      {notAuth ? (
        <p>You should log in to see list</p>
      ) : (
        <div>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div>
              {wishlist.map(({ id, wish, desc, comments }) => (
                <div className="article" key={`random-${id}`}>
                  <h2 className="list-title">{wish}</h2>
                  <p>{desc}</p>

                  {comments.map(({ text, users, id }) => {
                    return (
                      <div className="commentOne" key={id}>
                        <p className="comment-text">{text}</p>
                        <p className="comment-author">
                          {users.first_name} {users.last_name}
                        </p>
                        <p className="comment-time">{users.created_at}</p>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* <div key={`random-${wishlist.id}`} className="list-div">
                <h1 className="title-list">{wishlist.wish}</h1>
                <p className="p-center"> Written by {data.author}</p>
                <div className="list-single">
                  <p>1. {data.item_1}</p>

                  <p>2. {data.item_2}</p>

                  <p>3. {data.item_3}</p>
                </div>
              </div> */}
              {/* <div className="div-comments">
                <h2>Comments</h2>
                {data.comments.map(({ id, text, users, time }) => (
                  <div key={id}>
                    <div class="comment-div">
                      <p className="comment-name">
                        Written by {users.first_name} {users.last_name}
                      </p>
                      <p className="comment-time">Written time {time}</p>
                    </div>
                    <p className="single-comment">{text}</p>
                  </div>
                ))}
              </div> */}
            </div>
          )}
          {/* <AddComment listId={params.listId} parentMethod={fetchList} /> */}
        </div>
      )}
    </>
  );
}
