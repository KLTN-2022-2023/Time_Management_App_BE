const User = require("../models/user.js");
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

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
router.post("/Login", (req, res) => {
  //login info
  const email = req.body.email;
  const password = req.body.password;

  try {
    User.findOne({ email: email }).then((foundUser) => {
      //User not found
      if (foundUser == null) {
        const responseUser = {
          message: "User not found",
          isSuccess: false,
          data: null,
        };

        res.status(404).send(responseUser);
      }
      // User found
      else {
        //Password
        const decryptedPassword = CryptoJS.enc.Base64.parse(
          foundUser.password
        ).toString(CryptoJS.enc.Utf8);

        // Correct password
        if (decryptedPassword != null && decryptedPassword == password) {
          // Create Token
          const token = jwt.sign(
            { _id: foundUser._id, email: foundUser.email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "102h",
            }
          );

          const response = {
            message: "Login Successfully",
            isSuccess: true,
            data: token,
          };

          res.status(200).json(response);
        } else {
          const responsePassword = {
            message: "Password is not correct",
            isSuccess: false,
            data: null,
          };

          res.status(404).send(responsePassword);
        }
      }
    });
  } catch (error) {
    const responseError = {
      message: error.message,
      isSuccess: false,
      data: null,
    };

    res.status(400).json(responseError);
  }
});

// Get user by id
router.post("/GetUserById", auth, (req, res) => {
  //login info
  const userId = req.body.userId;

  try {
    User.findById(userId).then((user) => {
      if (user == null) {
        const response = {
          message: "Not Found",
          isSuccess: false,
          data: null,
        };

        res.status(404).json(response);
      } else {
        const response = {
          message: "Successfully",
          isSuccess: true,
          data: user,
        };

        res.status(200).json(response);
      }
    });
  } catch (error) {
    const responseError = {
      message: error.message,
      isSuccess: false,
      data: null,
    };

    res.status(400).json(responseError);
  }
});
router.post("/UpdateProfile", auth, async (req, res) => {
  // const email = req.body.email;
  // const name = req.body.name;
  // const address = req.body.address;
  // const age = req.body.age;
  const id = req.body.userId;
  const updatedData = req.body;
  const options = { new: true };
  try {
    const result = await User.findByIdAndUpdate(id, updatedData, options);
    console.log(updatedData);
    if (result == null) {
      const response = {
        message: "Update Failed",
        isSuccess: false,
        data: null,
      };
    res.status(404).send(response);
    }else {
      const response = {
        message: "Update Successfully",
        isSuccess: true,
        data: result,
      };

      res.status(200).json(response);
    }
  } catch (err) {
    const responseError = {
      message: error.message,
      isSuccess: false,
      data: null,
    };

    res.status(400).json(responseError);
  }
})
module.exports = router;
