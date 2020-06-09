import React, { useState } from "react";

import axios from "axios";
import Error from "./Error";

const AddComment = (props) => {
  const [text, setText] = useState();
  const [error, setError] = useState("");
  // console.log(props.listId);
  const loggedIn = localStorage.getItem("id");
  const listId = props.listId;

  const addNewComment = async (e) => {
    e.preventDefault();

    try {
      setText("");
      const userid = localStorage.getItem("id");
      if (userid) {
        const comment = { text };
        const addedCommentRes = await axios
          .post(`http://localhost:9090/${userid}/addcomment/${listId}`, comment)
          .catch((error) => console.log(error.message));
        console.log(addedCommentRes);

        if (addedCommentRes.data.error) {
          setError(addedCommentRes.data.error);
        }
        props.fetchComments();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <form onSubmit={addNewComment} className="add-comment form-style-6">
          {error && <Error error={error} clearError={() => setError("")} />}
          <textarea
            type="text"
            id="text"
            value={text}
            placeholder="Text"
            onChange={(e) => setText(e.target.value)}
          />
          <button className="example_b comment-btn">Add comment</button>
        </form>
      ) : (
        <p>Only authorized users can leave comments</p>
      )}
    </div>
  );
};

export default AddComment;
