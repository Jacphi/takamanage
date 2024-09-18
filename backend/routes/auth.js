const express = require("express");

const User = require("../models/user");

const { body } = require("express-validator");

const authController = require("../controllers/auth");

const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("firstName").trim().not().isEmpty(),
    body("lastName").trim().not().isEmpty(),
  ],
  authController.addUser
);

router.post("/login", authController.login);


router.get("/my-projects", isAuth, authController.getProjects);


module.exports = router;
