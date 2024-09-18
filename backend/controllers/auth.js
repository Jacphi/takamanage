const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.addUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const email = req.body.email;
  const chat = req.body.chat;

  bcrypt
    .hash(password, 12)
    .then((hashedpassword) => {
      const user = new User({
        firstName: firstName,
        lastName: lastName,
        password: hashedpassword,
        email: email,
        chat: chat,
      });

      return user.save();
    })

    .then((result) => {
      // console.log(result);
      return this.login(req, res, next);
    })
    // .then(result => {
    //   res.status(201).json({ message: "User created!", userId: result._id });
    // })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Login error");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Login error");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        "secretkey"
      );

      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};


exports.getProjects = (req, res, next) => {
  const userId = req.userId;
  User.findById(userId)
    .populate("projects")
    .then((user) => {
      return user.projects;
    })
    .then((projects) => {
      console.log("Projects");
      res.status(200).json({
        projects: projects,
        message: "User is member of these projects",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
