const router = require("express").Router();
const config = require("config");

const User = require("../../models/User");

const Wish = require("../../models/Wish");
const auth = require("../../middleware/auth");

//@route GET all wishes with all comments and user's data
router.get("/wishes", async (req, res) => {
  const wishes = await Wish.query()
    .withGraphFetched("users")
    .withGraphFetched("comments");
  return res.send(wishes);
});

//@route GET  wishe by id + user's name + comment with name and if user has no data, only name and email
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
    id: null,
    text: null,
    created: null,
    firstName: null,
    lastName: null,
  };
  try {
    let list = await Wish.query()
      .where({ user_id: user_id })
      .withGraphFetched("users")
      .withGraphFetched("comments.[users]");

    if (list.length) {
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
            id: comment.id,
            text: comment.text,
            created: comment.created_at,
            firstName: comment.users.first_name,
            lastName: comment.users.last_name,
          };
          oneWish.comments.push(oneComment);
        });
      });
    } else {
      const userAlone = await User.query().where({ id: user_id });
      userAlone.forEach((one) => {
        user = {
          name: one.first_name,
          lastName: one.last_name,
          email: one.email,
          wishes: [],
        };
      });
    }
    return res.send(user);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

//@route Add wish
router.post("/:id/addwish", async (req, res) => {
  const id = req.params.id;

  const { wish, desc } = req.body;

  if (wish && desc) {
    if (wish.length < 3) {
      return res
        .status(403)
        .send({ error: "Wish should be minimum 3 charcters" });
    } else {
      try {
        const newWish = await Wish.query().insert({
          wish: wish,
          desc: desc,
          user_id: id,
        });

        return res.send({ wish: newWish.wish });
      } catch (error) {
        return res.send({ response: error.message });
      }
    }
  } else {
    return res.status(403).send({ error: "All fields are required" });
  }
});

//@route for save image path to db
router.post("/:id/addimage", async (req, res) => {
  const wishID = req.params.id;

  const { imgUrl } = req.body;

  if (imgUrl) {
    try {
      const updatedLink = await Wish.query()
        .update({ imgURL: imgUrl })
        .where("id", wishID);

      return res.send({ updatedLink });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  } else {
    return res.status(403).send({ error: "Fields are not filled correctly" });
  }
});

//@route update wish
router.put("/edit/wish/:id", auth, async (req, res) => {
  const wishId = req.params.id;
  const { wish, desc } = req.body;

  if (wish && desc) {
    try {
      const wishToUpdate = await Wish.query().where("id", wishId);
      if (!wishToUpdate.length) {
        return res.send({ response: "there is no wish with this id" });
      } else {
        if (wishToUpdate.wish != wish) {
          await Wish.query().where({ id: wishId }).update({
            wish: wish,
          });
        }
        if (wishToUpdate.desc != desc) {
          await Wish.query().where({ id: wishId }).update({
            desc: desc,
          });
        }
        return res.send({ response: "wish updated" });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  } else {
    return res.status(403).send({ error: "All fields are required" });
  }
});

//@route delete a wish
router.delete("/deletewish/:id", auth, async (req, res) => {
  const wishId = req.params.id;
  try {
    const deletedWish = await Wish.query().delete().where({ id: wishId });
    return res.send({ msg: "wish is deleted" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
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

module.exports = router;
