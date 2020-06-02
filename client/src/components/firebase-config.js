import firebase from "firebase/app";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDD1PO2QD3r-8IilISqzDe1FmZqAtqSDL4",
  authDomain: "wishlist-8b07c.firebaseapp.com",
  databaseURL: "https://wishlist-8b07c.firebaseio.com",
  projectId: "wishlist-8b07c",
  storageBucket: "wishlist-8b07c.appspot.com",
  messagingSenderId: "568338190383",
  appId: "1:568338190383:web:fd0c5cf9bb5fd9352d36da",
  measurementId: "G-Y24WL2NCJ0",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

let storage = firebase.storage();

export { storage, firebase };
// export default firebaseApp;
