import React, { useState, useEffect } from "react";
// import "../css/listcontainer.css";

import { Link } from "react-router-dom";

export default function ListContainer(props) {
  const [data, setData] = useState();

  const [loading, setLoading] = useState(true);

  let loggedIn = localStorage.getItem("id");

  useEffect(() => console.log(data), [data]);

  const getLists = async (e) => {
    const lists = props.lists;
    console.log(props.lists);

    setData(lists);
    setLoading(false);
    console.log(lists);
  };

  useEffect(() => {
    getLists();
  }, []);

  return (
    <>
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="articleContainer">
          {data.lists.map(({ id, wish, desc, userName, userLastName }) => (
            <div className="article" key={`random-${id}`}>
              <h2 className="list-title">{wish}</h2>
              <p>{desc}</p>

              <p> {userName}</p>

              <p>{userLastName}</p>
              {loggedIn ? (
                <Link to={`/list/${id}`}>
                  <button className="example_b" align="center" id={id}>
                    Add/Read comment
                  </button>
                </Link>
              ) : (
                <h5>Please log in to read/add comments</h5>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
