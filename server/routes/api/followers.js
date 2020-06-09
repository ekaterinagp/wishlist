const router = require("express").Router();
const config = require("config");
const User = require("../../models/User");
const Follower = require("../../models/Follower");

//@route GET all user's  and all who  follows the user
router.get("/followers", async (req, res) => {
  const following = await User.query().withGraphFetched("followers");
  return res.send(following);
});

//@route GET a user and who user follows
router.get("/followers/:id", async (req, res) => {
  const userID = req.params.id;

  const followers = {
    follows: [],
    followers: [],
  };

  const following = await Follower.query()
    .where("user_id", userID)
    .withGraphFetched("users");

  following.forEach((one) => {
    followers.follows.push(one.follows_id);
  });

  const follows = await Follower.query()
    .where("follows_id", userID)
    .withGraphFetched("users");

  follows.forEach((one) => {
    followers.followers.push(one.user_id);
  });

  return res.send(followers);
});

//@route POST add a user to follow
router.post("/follow", async (req, res) => {
  const { follower_id, user_id } = req.body;
  console.log(req.body);

  if (follower_id && user_id) {
    try {
      const existingFollower = await Follower.query()
        .select()
        .where({ follows_id: follower_id })
        .andWhere({ user_id: user_id });

      if (existingFollower[0]) {
        return res.send({ res: "User already followed" });
      } else {
        const newFollower = await Follower.query().insert({
          user_id: user_id,
          follows_id: follower_id,
        });
        return res.send(newFollower);
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
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
      return res.send(unfollow);
    } catch (error) {
      return res.status(500).send({ res: error.message });
    }
  }
});

module.exports = router;
