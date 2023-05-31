const Notification = require("../models/notification");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Find notifications by userId
router.post("/GetNotificationsByUserId", auth, (req, res) => {
  //login info
  const userId = req.body.userId;

  try {
    Notification.find({ userId: userId, isDeleted: false }).then((tasks) => {
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

// Fake Delete Notification by task id
router.delete("/DeleteNotification/:taskId", auth, (req, res) => {
  // Id
  const id = req.params.taskId;
  const options = { new: true };

  Notification.findOne({ taskId: id, isDeleted: false })
    .then((task) => {
      if (task == null) {
        const response = {
          message: "Notification not found",
          isSuccess: true,
          data: null,
        };

        res.status(200).json(response);
      } else {
        // Update Important
        task.isDeleted = true;

        // Update
        Notification.findByIdAndUpdate(task.id, task, options)
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

//Create Task
router.post("/CreateNotification", auth, async (req, res) => {
  const dataReq = {
    userId: req.body.userId,
    taskId: req.body.taskId,
    title: req.body.title,
    content: req.body.content,
    isSeen: req.body.isSeen,
    remindTime: req.body.remindTime,
  };
  const data = new Notification(dataReq);

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

module.exports = router;
