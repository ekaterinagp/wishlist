const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const cors = require("cors");
const config = require("config");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 9090;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { Model } = require("objection");
const Knex = require("knex"); //library
const knexfile = require("./knexfile.js"); //file contains credentials

const knex = Knex(knexfile.development);

// Give the knex instance to objection.
Model.knex(knex);

const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 4 requests per windowMs
});

const usersRouter = require("./routes/api/users");
const followersRouter = require("./routes/api/followers");

const wishesRouter = require("./routes/api/wishes");
// const sendMailRouter = require("./routes/api/sendMail");
const commentsRouter = require("./routes/api/comments");
app.use(usersRouter, authLimiter);
app.use(wishesRouter);
app.use(commentsRouter);
app.use(followersRouter);
// app.use(sendMailRouter);

const server = app.listen(port, (error) => {
  if (error) {
    console.log("Error running express", error);
  }
  console.log("The server is running on port", server.address().port);
});
