const router = require("express").Router();
const config = require("config");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const jwSecret = config.get("jwtSecret");
const User = require("../../models/User");
const Details = require("../../models/Details");

//@route GET all users
router.get("/users", async (req, res) => {
  const users = await User.query().select();
  return res.send(users);
});

//@route GET all users with details
router.get("/details", async (req, res) => {
  const users = await User.query().withGraphFetched("details");
  return res.send(users);
});

//@route GET a users with details

router.get("/details/:id", async (req, res) => {
  const id = req.params.id;
  let userDetails = {
    size: null,
    shop: null,
    color: null,
  };
  try {
    const users = await User.query()
      .where("id", id)
      .withGraphFetched("details")
      .limit(1);
    console.log("user here", users);
    if (users[0].details) {
      userDetails = {
        size: users[0].details.size,
        shop: users[0].details.shop,
        color: users[0].details.color,
      };
      return res.send(userDetails);
    } else {
      return res.send({ res: "No details yet" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//@route all users and all wishes
router.get("/userswishes", async (req, res) => {
  const users = await User.query().withGraphFetched("wishes");
  return res.send(users);
});

//@route GET one user by id + wishes
router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.query().where("id", id).withGraphFetched("wishes");

    let newUser = {
      firstName: user[0].first_name,
      lastName: user[0].last_name,
      email: user[0].email,
      wishes: [],
    };

    user[0].wishes.forEach((wish) => {
      let newWish = {
        wish: wish.wish,
        desc: wish.desc,
      };
      newUser.wishes.push(newWish);
    });

    return res.send(newUser);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

//@route POST register user
router.post("/register", (req, res) => {
  const { email, password, passwordCheck, firstName, lastName } = req.body;
  console.log(req.body);
  if (
    email &&
    password &&
    passwordCheck &&
    firstName &&
    lastName &&
    password === passwordCheck
  ) {
    if (password.length < 8) {
      return res
        .status(403)
        .send({ error: "Password must be 8 characters minimum" });
    } else {
      bcrypt.hash(password, saltRounds, async (error, hashedPassword) => {
        if (error) {
          return res.status(500).send({ message: "error hashing password" });
        }
        try {
          const existingUser = await User.query()
            .select()
            .where({ email: email })
            .limit(1);

          if (existingUser[0]) {
            return res.status(403).send({ error: "User already exists" });
          } else {
            const newUser = await User.query().insert({
              first_name: firstName,
              last_name: lastName,
              email,
              password: hashedPassword,
            });

            return res.status(200).send({ email: newUser.email });
          }
        } catch (error) {
          return res.status(500).send({ message: error.message });
        }
      });
    }
  } else if (password !== passwordCheck) {
    return res
      .status(403)
      .send({ error: "Password and repeated password are not the same" });
  } else {
    return res.status(403).send({ error: "All fields are required" });
  }
});

//@route POST login of a user
router.post("/login", async (req, res) => {
  // console.log(req.body);
  try {
    const { email, password } = req.body;
    // console.log(req.body);

    const users = await User.query().select().where({ email: email }).limit(1);
    const user = users[0];

    if (!user) {
      return res
        .status(403)
        .send({ error: "User with this email does not exist" });
    }

    if (email && password) {
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) return res.status(403).send({ error: "Wrong password" });
        jwt.sign(
          { id: user.id },
          config.get("jwtSecret"),
          {
            expiresIn: 3600,
          },
          (err, token) => {
            if (err) throw err;
            res.json({
              token: token,
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              },
            });
          }
        );
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//@route if token is valid
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    console.log(token);
    if (!token) return res.json(false);

    const verified = jwt.verify(token, jwSecret);
    console.log(verified.id);
    if (!verified) return res.json(false);

    const user = await User.query().select().where({ id: verified.id });
    if (!user) return res.json(false);

    return res.json(true);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//@route add details
router.post("/:id/details/add", async (req, res) => {
  const userId = req.params.id;

  const { size, color, shop } = req.body;

  if (size || color || shop) {
    try {
      const newDetails = await Details.query().insert({
        user_id: userId,
        size: size,
        color: color,
        shop: shop,
      });
      console.log(newDetails);
      return res.send(newDetails);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  } else {
    return res.status(403).send({ error: "All fields are empty" });
  }
});

//@route update personal details
router.put("/edit/:id/settings", auth, async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email } = req.body;
  if (firstName && lastName && email) {
    try {
      const user = await User.query().select().where({ id: userId });

      if (user.first_name != firstName) {
        await User.query().where({ id: userId }).update({
          first_name: firstName,
        });
      }
      if (user.last_name != lastName) {
        await User.query().where({ id: userId }).update({
          last_name: lastName,
        });
      }
      if (user.email != email) {
        await User.query().where({ id: userId }).update({
          email: email,
        });
      }
      return res.status(200).send({ response: "user updated" });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  } else {
    return res.status(403).send({ error: "Fields are missing" });
  }
});

//@route update preferences
router.put("/edit/:id/preferences", auth, async (req, res) => {
  const userId = req.params.id;
  const { size, color, shop } = req.body;
  if (size || color || shop) {
    try {
      console.log("we are in try");
      const details = await Details.query()
        .select()
        .where({ user_id: userId })
        .limit(1);
      console.log(details);
      if (!details.length) {
        const newDetails = await Details.query().insert({
          user_id: userId,
          size: size,
          color: color,
          shop: shop,
        });
        console.log(newDetails);
        return res.send(newDetails);
      } else {
        if (details.color != color) {
          await Details.query().where({ user_id: userId }).update({
            color: color,
          });
        }
        if (details.size != size) {
          await Details.query().where({ user_id: userId }).update({
            size: size,
          });
        }
        if (details.shop != shop) {
          await Details.query().where({ user_id: userId }).update({
            shop: shop,
          });
        }
        return res.status(200).send({ response: "preferences updated" });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  } else {
    return res.status(403).send({ error: "Fields are missing" });
  }
});

//@route delete user
router.delete("/delete/:id", auth, async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.query().delete().where({ id: userId });
    res.status(200).send({ response: "user is deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// //@route reset password
// router.post("/change-password/:id", async (req, res) => {
//   try {
//     const { email, password, newPassword } = req.body;
//     const userId = req.params.id;
//     const users = await User.query().select().where({ email: email }).limit(1);
//     const user = users[0];
//     if (!user) {
//       return res.send({ message: "User with this email does not exist" });
//     }
//     if (email && password && newPassword) {
//       bcrypt.compare(password, user.password, function (err, hash) {
//         if (err) {
//           return res.json({ message: "Wrong password" });
//         }
//         if (res) {
//           console.log("old password matched");
//           if (newPassword < 8) {
//             return res.send({
//               message: "Password does not fulfill the requirements",
//             });
//           } else {
//             console.log("new password will be hashed");
//             bcrypt.hash(
//               newPassword,
//               saltRounds,
//               async (error, hashedPassword) => {
//                 console.log(hashedPassword);
//                 if (error) {
//                   return res.send({ message: "error hashing password" });
//                 }
//                 try {
//                   const updatedUser = await User.query()
//                     .update({ password: hashedPassword })
//                     .where("id", userId);
//                   console.log(updatedUser);
//                   return res.send({ updatedUser });
//                 } catch (error) {
//                   return res.send({ message: error.message });
//                 }
//               }
//             );
//           }
//         } else {
//           return res.send({ message: "old password didn't match" });
//         }
//       });
//     }
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

module.exports = router;
