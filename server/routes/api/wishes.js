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
  return res.status(200).send(wishes);
});

//@route GET  wishe by id + user's name + comment with name
router.get("/list/:id", async (req, res) => {
  const wishID = req.params.id;
  let list = await Wish.query()
    .where({ id: wishID })
    .withGraphFetched("users")
    .withGraphFetched("comments.[users]");
  return res.status(200).send(list);
});

//@route POST wish
router.post("/:id/wish/add", async (req, res) => {
  const id = req.params.id;

  const { wish, desc } = req.body;
  console.log(req.body);
  if (wish && desc) {
    console.log("all fields there");
    if (wish.length < 4) {
      return res.status(400).send({
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
        return res.status(200).send({ wish: newWish.wish });
      } catch (error) {
        return res.status(500).send({ response: error.message });
      }
    }
  } else {
    return res
      .status(500)
      .send({ response: "Fields are not filled correctly" });
  }
});

router.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "No file upload" });
  }
  const file = req.files.file;

  file.mv(`${__dirname}/../../uploads/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
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
