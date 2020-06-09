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
router.post("/:userID/addcomment/:wishID/", async (req, res) => {
  const userID = req.params.userID;
  const wishID = req.params.wishID;
  const { text } = req.body;
  console.log(req.body);
  if (text) {
    try {
      const newComment = await Comment.query().insert({
        text: text,
        user_id: userID,
        wish_id: wishID,
      });
      return res.send(newComment);
    } catch (error) {
      return res.status(500).send({ response: error.message });
    }
  } else {
    return res.json({ error: "Comment can not be empty" });
  }
});

//@route ti delete a comment
router.delete("/deletecomment/:id", auth, async (req, res) => {
  const commentId = req.params.id;
  try {
    const deletedcomment = await Comment.query()
      .delete()
      .where({ id: commentId });
    res.json({ msg: "comment is deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
