const router = require("express").Router();
const config = require("config");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
// const jwt = require("jsonwebtoken");
// const auth = require("../../middleware/auth");
// const jwSecret = config.get("jwtSecret");
const User = require("../../models/User");
// const Comment = require("../../models/Comment");
const Wish = require("../../models/Wish");

//@route GET all wishes with all comments and user's data
router.get("/wishes", async (req, res) => {
  const wishes = await Wish.query()
    .withGraphFetched("users")
    .withGraphFetched("comments");
  return res.send(wishes);
});

//@route GET  wishe by id + user's name + comment with name
router.get("/list/:id", async (req, res) => {
  const user_id = req.params.id;
  let user = {
    name: null,
    lastName: null,
    email: null,
    wishes: [],
  };
  let oneWish = {
    id: null,
    wish: null,
    desc: null,
    imgURL: null,
    created: null,
    comments: [],
  };

  let oneComment = {
    text: null,
    created: null,
    firstName: null,
    lastName: null,
  };
  let list = await Wish.query()
    .where({ user_id: user_id })
    .withGraphFetched("users")
    .withGraphFetched("comments.[users]");
  console.log(list);
  list.forEach((list) => {
    user = {
      name: list.users.first_name,
      lastName: list.users.last_name,
      email: list.users.email,
      wishes: [],
    };
  });

  list.forEach((list) => {
    oneWish = {
      id: list.id,
      wish: list.wish,
      desc: list.desc,
      imgURL: list.imgURL,
      created: list.created_at,
      comments: [],
    };
    user.wishes.push(oneWish);
    list.comments.forEach((comment) => {
      oneComment = {
        text: comment.text,
        created: comment.created_at,
        firstName: comment.users.first_name,
        lastName: comment.users.last_name,
      };
      oneWish.comments.push(oneComment);
    });
  });

  return res.send(user);
});

//@route POST wish
router.post("/:id/wish/add", async (req, res) => {
  const id = req.params.id;

  const { wish, desc } = req.body;
  console.log(req.body);
  if (wish && desc) {
    console.log("all fields there");
    if (wish.length < 4) {
      return res.send({
        response: "Wish should be min 4 char",
      });
    } else {
      try {
        console.log("we are in a try");
        const newWish = await Wish.query().insert({
          wish: wish,
          desc: desc,
          user_id: id,
        });
        console.log(newWish);
        return res.send({ wish: newWish.wish });
      } catch (error) {
        return res.send({ response: error.message });
      }
    }
  } else {
    return res.send({ response: "Fields are not filled correctly" });
  }
});

//@route for save image path to db
router.post("/:id/image/add", async (req, res) => {
  const wishID = req.params.id;
  console.log(req.body);
  const { imgUrl } = req.body;
  console.log(imgUrl);
  if (imgUrl) {
    console.log("all fields there");
    console.log(imgUrl);
    try {
      console.log("we are in a try");
      const updatedLink = await Wish.query()
        .update({ imgURL: imgUrl })
        .where("id", wishID);

      console.log(updatedLink);
      return res.send({ updatedLink });
    } catch (error) {
      return res.send({ response: error.message });
    }
  } else {
    return res.send({ response: "Fields are not filled correctly" });
  }
});

//@route to upload image to backend folder
router.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.json({ msg: "No file upload" });
  }
  const file = req.files.file;

  file.mv(`${__dirname}/../../uploads/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }

    return res.json({
      fileName: file.name,
      filePath: `../../uploads/${file.name}`,
    });
  });
});

// router.post("/upload", (req,res)=>{
//   const newImage={
//     imageName:req.body.imageName,
//     imageData:req.body.imageData
//   }

// })

module.exports = router;
