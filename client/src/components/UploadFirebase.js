import React, { useState, useEffect } from "react";
import { storage } from "./firebase-config";
import { firebase } from "./firebase-config";
import "../css/profile.css";
import uui from "uuidv4";
import axios from "axios";

const UploadFirebase = (props) => {
  console.log(props);
  // console.log(props.wishID);
  // const allInputs = {  };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(props.img);

  // console.log(imageAsFile);
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    console.log("name?", image.name);
    setImageAsFile((imageFile) => image);
    console.log(imageAsFile);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const addLink = async (img) => {
    console.log(img);
    const regex = /.+?(?=&)/g;
    const modified = img.imgUrl.match(regex)[0];
    const res = await axios
      .post(`http://localhost:9090/${props.wishID}/image/add`, {
        imgUrl: modified,
      })
      .catch((error) => console.log(error));
    console.log(res);
    refreshPage();
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();

    if (imageAsFile === "") {
      console.error(`not an image, the image file is a ${typeof imageAsFile}`);
    }

    const uploadTask = storage
      .ref(`/images/${imageAsFile.name}`)
      .put(imageAsFile);

    //initiates the firebase side uploading
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref("images")
          .child(imageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImageAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };

  useEffect(() => {
    if (imageAsUrl !== props.img) {
      // console.log(imageAsUrl);
      addLink(imageAsUrl);
    }
  }, [imageAsUrl]);

  // console.log(imageAsUrl);
  return (
    <div>
      <form onSubmit={handleFireBaseUpload}>
        <input
          type="file"
          className="input-firebase"
          onChange={handleImageAsFile}
        />
        <button className="example_b uploads">Upload</button>
      </form>
      {!imageAsUrl ? (
        <div
          className="wish-div"
          style={{
            backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/wishlist-8b07c.appspot.com/o/images%2Fdefault.jpg?alt=media)`,
          }}
        ></div>
      ) : (
        // <img className="wish-img" src={imageAsUrl} alt="image tag" />
        <div
          className="wish-div"
          style={{ backgroundImage: `url(${imageAsUrl})` }}
        />
      )}
    </div>
  );
};

export default UploadFirebase;
