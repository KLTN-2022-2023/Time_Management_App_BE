const User = require("../models/user.js");
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");

//Add User
router.post("/AddUser", async (req, res) => {
  //Password
  const encryptedPassword = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(req.body.password)
  );

  const data = new User({
    name: req.body.name,
    address: req.body.address,
    age: req.body.age,
    email: req.body.email,
    password: encryptedPassword.toString(),
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Login
router.get("/Login", (req, res) => {
  //login info
  const email = req.body.email;
  const password = req.body.password;

  try {
    User.findOne({ email: email }).then((foundUser) => {
      //User not found
      if (foundUser == null) {
        res.status(404).send({
          error: "User not found",
        });
      }
      //User found
      else {
        //Password
        const decryptedPassword = CryptoJS.enc.Base64.parse(
          foundUser.password
        ).toString(CryptoJS.enc.Utf8);

        if (decryptedPassword != null && decryptedPassword == password) {
          res.status(200).json(foundUser);
        } else {
          res.status(404).send({
            error: "Password is not correct",
          });
        }
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
