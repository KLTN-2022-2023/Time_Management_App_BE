const StaticValue = require("../models/static");
const Task = require("../models/task.js");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Create Task
router.post("/CreateTask", auth, async (req, res) => {
  const data = new Task({
    userId: req.body.userId,
    parentId: req.body.parentId,
    name: req.body.name,
    description: req.body.description,
    files: req.body.files,
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

//Find task by userId
router.get("/GetTasksByUserId", auth, (req, res) => {
  //login info
  const userId = req.body.userId;

  try {
    Task.find({ userId: userId }).then((tasks) => {
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

//Update Task
router.put("/UpdateTask", auth, async (req, res) => {
  //login info
  const id = req.body._id;
  const updatedData = req.body;
  const options = { new: true };

  try {
    const result = await Task.findByIdAndUpdate(id, updatedData, options);

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

//Delete Task
router.delete("/DeleteTask/:id", auth, async (req, res) => {
  //login info
  const id = req.params.id;
  try {
    const result = await Task.findByIdAndDelete(id);

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

module.exports = router;
