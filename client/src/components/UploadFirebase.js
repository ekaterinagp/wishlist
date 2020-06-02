import React, { useState, useEffect } from "react";
import { storage } from "./firebase-config";
import { firebase } from "./firebase-config";
import uui from "uuidv4";
import axios from "axios";

const UploadFirebase = (props) => {
  // console.log(props.wishID);
  const allInputs = { imgUrl: "" };
  const [imageAsFile, setImageAsFile] = useState("");
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);

  // console.log(imageAsFile);
  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    console.log("name?", image.name);
    setImageAsFile((imageFile) => image);
    // addLink(image.name);
    console.log(imageAsFile);
  };

  const addLink = async (img) => {
    console.log(img);
    const imgUrl = {
      imgUrl: img,
    };
    const res = await axios
      .post(`http://localhost:9090/${props.wishID}/image/add`, imgUrl)
      .catch((error) => console.log(error));
    console.log(res);
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log("start of upload");
    // async magic goes here...
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
        addLink(imageAsFile);
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

  // let ref = firebase.storage().ref();
  // var starsRef = ref.child(
  //   "images/41946020_2376465382368423_2354478531678830592_n.jpg"
  // );

  // starsRef.getDownloadURL().then(function (url) {
  //   setImageAsUrl({
  //     imgUrl: url,
  //   });
  //
  // });

  useEffect(() => {
    addLink(imageAsFile.name);
  }, [imageAsFile]);
  console.log(imageAsFile);
  return (
    <div>
      <form onSubmit={handleFireBaseUpload}>
        <input type="file" onChange={handleImageAsFile} />
        <button>upload to firebase</button>
      </form>
      <img src={imageAsUrl.imgUrl} alt="image tag" />
    </div>
  );
};

export default UploadFirebase;
