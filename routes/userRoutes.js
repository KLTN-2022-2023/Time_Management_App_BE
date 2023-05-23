const User = require("../models/user.js");
const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { ConfigService } = require("aws-sdk");
//const accountSid = 'AC623b3d98550ffd441ff974b54913dd6c';
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHENTOKEN;
const client = require('twilio')(accountSid, authToken);
//Add User
let OTP, user, handleForgot;
router.post("/SignUp", async (req, res) => {
  //Password
  const encryptedPassword = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(req.body.password)
  );
  const phone = req.body.phone;
  let a = 0;
  try {
    await User.find({}).then((user) => {
      user.forEach((e) => {
        if (phone == e.phone) {
          a++;
        }
      })
    })
    if (a < 1) {
      const data = new User({
        name: req.body.name,
        phone: req.body.phone,
        password: encryptedPassword.toString(),
      });
      user = data;
      let digits = "0123456789";
      OTP = "";
      for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
      }
      if (phone === "0369548201" && phone.length == 10) {
        await client.messages
          .create({
            from: "+13203563587",
            to: `+84${phone}`,
            body: `Your otp verification for you is ${OTP}`
          })
          .then(message => console.log(message.sid))
          .done();
        res.status(200).json({ msg: "Successfully" })
      }
      else {
        res.status(400).json({ msg: "Fail" })
      }

    } else {
      res.status(200).json({ msg: "Phone already exist" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.post("/ForgotPassWord", async (req, res) => {
  const phone = req.body.phone;
  try {
    let digits = "0123456789";
    OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    if (phone === "0369548201") {
      await client.messages
        .create({
          from: "+13203563587",
          to: `+84${phone}`,
          body: `Your otp verification for you is ${OTP}`
        })
        .then(message => console.log(message.sid))
        .done();
      res.status(200).json({ msg: "Successfully" })
    } else {
      res.status(400).json({ msg: "Fail" })
    }


  } catch (err) {
    const responseError = {
      message: err.message,
      isSuccess: false,
      data: null,
    };
    res.status(400).json(responseError);
  }
})
router.post("/VerifyForgot", async (req, res) => {
  try {
    const otp = req.body.otp;
    if (otp === OTP) {

      res.status(200).json({ msg: "OTP correct" });
    } else {
      res.status(500).json({ msg: "OTP incorrect" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
router.post("/ForgotNewPassword", async (req, res) => {
  const phone = req.body.phone
  const newPass = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(req.body.newPassword)
  );

  try {
    var dataUser;
    console.log(phone);
    await User.findOne({ phone }).then((usera) => {
      if (usera == null) {
        const response = {
          message: "Not Found",
          isSuccess: false,
          data: null,
        };
      } else {
        usera.password = newPass;
        dataUser = usera;
        const response = {
          message: "Successfully",
          isSuccess: true,
          data: dataUser,
        };
      }
    })

    const a = await dataUser.save();
    console.log(a)
    res.status(200).json({ msg: "Successfully" })
  } catch (err) {
    res.status(400).json({ msg: "Fail" })
  }
})

router.post("/Verify", async (req, res) => {
  try {
    const otp = req.body.otp;

    console.log(otp, OTP)
    if (otp === OTP) {
      const a = await user.save();
      console.log(a)
      res.status(200).json({ user });
    } else {
      res.status(500).json({ msg: "Incorrect OTP" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
//Login
router.post("/Login", (req, res) => {
  //login info
  const phone = req.body.phone;
  const password = req.body.password;

  try {
    User.findOne({ phone: phone }).then((foundUser) => {
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
            { _id: foundUser._id, phone: foundUser.phone },
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
router.post("/GetUserByPhone", (req, res) => {
  //login info
  const phone = req.body.phone;

  try {
    User.findOne({ phone }).then((user) => {
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
    } else {
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
