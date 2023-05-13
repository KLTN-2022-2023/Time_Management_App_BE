const StaticValue = require("../models/static");
const Type = require("../models/type.js");
const Task = require("../models/task.js");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Create
router.post("/CreateType", auth, async (req, res) => {
  const data = new Type({
    name: req.body.name,
    description: req.body.description,
    userId: req.body.userId,
    createdDate: req.body.createdDate,
  });

  try {
    const dataToSave = await data.save();

    const response = {
      message: "Save Successfully",
      isSuccess: true,
      data: dataToSave,
    };

    res.status(200).json(response);
  } catch (error) {
    const responseError = {
      message: error.message,
      isSuccess: false,
      data: null,
    };

    res.status(400).json(responseError);
  }
});

//Update Type
router.put("/UpdateType", auth, async (req, res) => {
  //login info
  const id = req.body._id;
  const updatedData = req.body;
  const options = { new: true };

  try {
    const result = await Type.findByIdAndUpdate(id, updatedData, options);

    //Failed
    if (result == null) {
      const response = {
        message: "Update Failed",
        isSuccess: false,
        data: null,
      };

      res.status(404).send(response);
    }
    //Success
    else {
      const response = {
        message: "Update Successfully",
        isSuccess: true,
        data: result,
      };

      res.status(200).json(response);
    }
  } catch (error) {
    const responseError = {
      message: error.message,
      isSuccess: false,
      data: null,
    };

    res.status(400).json(responseError);
  }
});

// Delete Type
router.delete("/DeleteType/:id", auth, async (req, res) => {
  // Id
  const id = req.params.id;
  try {
    const result = await Type.findByIdAndDelete(id);

    //Failed
    if (result == null) {
      const response = {
        message: "Delete Failed",
        isSuccess: false,
        data: null,
      };

      res.status(404).send(response);
    }
    //Success
    else {
      const response = {
        message: "Delete Successfully",
        isSuccess: true,
        data: result,
      };

      res.status(200).send(response);
    }
  } catch (error) {
    const responseError = {
      message: error.message,
      isSuccess: false,
      data: null,
    };

    res.status(400).json(responseError);
  }
});

// Fake Delete Type
router.delete("/FakeDeleteType/:id", auth, (req, res) => {
  // Id
  const id = req.params.id;
  const options = { new: true };

  Type.findById(id)
    .then((task) => {
      if (task == null) {
        const response = {
          message: "Type not found",
          isSuccess: false,
          data: null,
        };

        res.status(200).json(response);
      } else {
        // Update Important
        task.isDeleted = true;

        // Update
        Type.findByIdAndUpdate(id, task, options)
          .then((responseData) => {
            if (responseData == null) {
              const response = {
                message: "Delete Failed",
                isSuccess: false,
                data: null,
              };

              res.status(404).send(response);
            } else {
              const response = {
                message: "Delete Successfully",
                isSuccess: true,
                data: responseData,
              };

              Task.updateMany(
                { typeId: id },
                { $set: { isDeleted: true } }
              ).then((resDelete) => console.log(resDelete));

              res.status(200).json(response);
            }
          })
          .catch((errData) => {
            const responseError = {
              message: errData.message,
              isSuccess: false,
              data: null,
            };

            res.status(400).json(responseError);
          });
      }
    })
    .catch((err) => {
      const responseError = {
        message: err.message,
        isSuccess: false,
        data: null,
      };

      res.status(400).json(responseError);
    });
});

//Find type by userId
router.post("/GetTypesByUserId", auth, (req, res) => {
  //login info
  const userId = req.body.userId;

  try {
    Type.find({ userId: userId, isDeleted: false }).then((tasks) => {
      if (tasks == null) {
        const response = {
          message: "Successfully",
          isSuccess: true,
          data: [],
        };

        res.status(200).json(response);
      } else {
        const response = {
          message: "Successfully",
          isSuccess: true,
          data: tasks,
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

module.exports = router;
