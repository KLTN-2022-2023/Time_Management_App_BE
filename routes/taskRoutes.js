const StaticValue = require("../models/static");
const Task = require("../models/task.js");
const express = require("express");
const router = express.Router();

//Create Task
router.post("/CreateTask", async (req, res) => {
  const data = new Task({
    userId: req.body.userId,
    parentId: req.body.parentId,
    name: req.body.name,
    description: req.body.description,
    files: req.body.files,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Find task by userId
router.get("/GetTasksByUserId", (req, res) => {
  //login info
  const userId = req.body.userId;

  try {
    Task.find({ userId: userId }).then((tasks) => {
      if (tasks == null) {
        res.status(200).json([]);
      } else {
        res.status(200).json(tasks);
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Update Task
router.put("/UpdateTask", async (req, res) => {
  //login info
  const id = req.body._id;
  const updatedData = req.body;
  const options = { new: true };

  try {
    const result = await Task.findByIdAndUpdate(id, updatedData, options);

    //Failed
    if (result == null) {
      res.status(404).send({
        error: "Update Failed",
      });
    }
    //Success
    else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete Task
router.delete("/DeleteTask/:id", async (req, res) => {
  //login info
  const id = req.params.id;
  try {
    const result = await Task.findByIdAndDelete(id);

    //Failed
    if (result == null) {
      res.status(404).send({
        isSuccess: false,
        error: "Update Failed",
        data: null,
      });
    }
    //Success
    else {
      res.status(200).send({
        isSuccess: true,
        message: "Update Failed",
        data: result,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
