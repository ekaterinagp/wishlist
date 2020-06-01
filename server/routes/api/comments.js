const router = require("express").Router();
const config = require("config");
const auth = require("../../middleware/auth");

const Comment = require("../../models/Comment");

//route get comments with user's data - USELESS
router.get("/comments", async (req, res) => {
  const comments = await Comment.query().withGraphFetched("users");

  return res.send({ response: comments });
});

//router add comment
router.post("/:userID/comment/list/:wishID/", async (req, res) => {
  const userID = req.params.userID;
  const wishID = req.params.wishID;
  const { text } = req.body;
  console.log(req.body);
  if (text.length) {
    try {
      const newComment = await Comment.query().insert({
        text: text,
        user_id: userID,
        wish_id: wishID,
      });
      return res.send(newComment);
    } catch (error) {
      return res.sendStatus(500).send({ response: error.message });
    }
  } else {
    return res.sendStatus(400).send({
      response: "Comment should be more than 3 charcaters",
    });
  }
});

module.exports = router;
