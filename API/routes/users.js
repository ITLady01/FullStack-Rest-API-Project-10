const express = require("express");
const authUser = require("../auth");
const router = express.Router();
const { User } = require("../models");
//const { check, validationResult } = require("express-validator/check");

//returns the currently authenticated user
router.get("/users", authUser, (req, res) => {
  const user = req.currentUser;
  res.status(200).json(user);
});

//creates a user, sets the location header to the home page and returns no content
router.post("/users", async (req, res, next) => {
  const { firstName, lastName, emailAddress, password } = req.body;

  try {
    await User.create({
      firstName,
      lastName,
      emailAddress,
      password
    });

    res.location(`/`); //Sets the response Location HTTP header to the specified path parameter.
    res.status(201); //Sets the HTTP status for the response.
    res.end(); //Ends the response process
  } catch (err) {
    err.message = err.errors.map(val => val.message);
    err.status = 400;

    next(err);
  }
});

module.exports = router;
