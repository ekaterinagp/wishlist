import React from "react";

const Notification = ({ msg, parentMethod, id, resetState }) => {
  console.log(msg, id);
  return (
    <div className="alert alert-info" role="alert">
      {console.log(msg)}
      {msg}
      <button
        type="button"
        className="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true" onClick={() => window.location.reload(false)}>
          &times;
        </span>
      </button>
      <button onClick={() => parentMethod(id)}>Delete</button>
    </div>
  );
};

export default Notification;
