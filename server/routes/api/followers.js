const router = require("express").Router();
const config = require("config");
const User = require("../../models/User");
const Follower = require("../../models/Follower");

//@route GET all user's  and all who  follows the user
router.get("/followers", async (req, res) => {
  const following = await User.query().withGraphFetched("followers");
  // .withGraphFetched("users.[followers]");
  return res.status(200).send(following);
});

//@route GET a user and who user follows
router.get("/followers/:id", async (req, res) => {
  const userID = req.params.id;
  const following = await Follower.query()
    .where("user_id", userID)
    .withGraphFetched("users");
  return res.status(200).send(following);
});

//@route POST add a user to follow
router.post("/follow", async (req, res) => {
  const { follower_id, user_id } = req.body;
  console.log(req.body);
  if (follower_id && user_id) {
    try {
      const newFollowing = await Follower.query().insert({
        user_id: user_id,
        follower_id: follower_id,
      });
      return res.status(200).send(newFollowing);
    } catch (error) {
      return res.status(500).send({ res: error.message });
    }
  }
});

//@rout unfollow user
router.delete("/unfollow", async (req, res) => {
  const { follower_id, user_id } = req.body;
  console.log(req.body);
  if (follower_id && user_id) {
    try {
      const unfollow = await Follower.query()
        .where("follower_id", follower_id)
        .where("user_id", user_id)
        .delete();
      return res.status(200).send(unfollow);
    } catch (error) {
      return res.status(500).send({ res: error.message });
    }
  }
});

module.exports = router;
