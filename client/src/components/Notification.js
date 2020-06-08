import React from "react";

const Notification = ({ msg, parentMethod, id, resetState }) => {
  console.log(msg, id);
  return (
    <div className="alert alert-info" role="alert">
      <button
        onClick={() => resetState()}
        id="button-close"
        type="button"
        className="close"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      {msg}
      <button className="example_b" onClick={() => parentMethod(id)}>
        Delete
      </button>
    </div>
  );
};

export default Notification;
