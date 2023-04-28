const StaticValue = require("../models/static");
const Task = require("../models/task.js");
const Type = require("../models/type.js");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Find task by start date, end date
router.post("/ReportByDate", auth, (req, res) => {
  //login info
  const userId = req.body.userId;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);

  try {
    Task.find({ userId: userId, isDeleted: false }).then((tasks) => {
      if (tasks == null) {
        const response = {
          message: "Successfully",
          isSuccess: true,
          data: [],
        };

        res.status(200).json(response);
      } else {
        let filteredData = tasks.filter((x) => {
          return (
            (startDate <= x.startTime && x.startTime <= endDate) ||
            (startDate <= x.dueTime && x.dueTime <= endDate)
          );
        });

        if (filteredData == null || filteredData.length == 0) {
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
            data: filteredData,
          };

          res.status(200).json(response);
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

module.exports = router;
