import React, { useState } from "react";
// import "../css/Article.css";
import axios from "axios";

const AddComment = (props) => {
  const [text, setText] = useState();
  // console.log(props.listId);
  const loggedIn = localStorage.getItem("id");
  const listId = props.listId;

  const addNewComment = async (e) => {
    // console.log(localStorage.getItem("id"));

    e.preventDefault();
    // console.log({ text });
    try {
      setText("");
      const userid = localStorage.getItem("id");
      if (userid) {
        const comment = { text };
        const addedCommentRes = await axios.post(
          `http://localhost:9090/${userid}/comment/list/${listId}`,
          comment
        );
        // console.log(addedCommentRes);
        props.parentMethod();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loggedIn ? (
        <form onSubmit={addNewComment} className="add-comment form-style-6">
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
