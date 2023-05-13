const StaticValue = require("../models/static");
const Task = require("../models/task.js");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

//Create Task
router.post("/CreateTask", auth, async (req, res) => {
  const dataReq = {
    name: req.body.name,
    typeId: req.body.typeId,
    userId: req.body.userId,
    description: req.body.description,
    files: req.body.files,
    checkList: req.body.checkList,
    isImportant: req.body.isImportant,
    status: req.body.status,
    startTime: req.body.startTime,
    dueTime: req.body.dueTime,
    remindTime: req.body.remindTime,
    remindMode: req.body.remindMode,
    repeatTime: req.body.repeatTime,
    endRepeat: req.body.endRepeat,
    isRepeatedById: req.body.isRepeatedById,
    createdDate: req.body.createdDate,
  };
  const data = new Task(dataReq);

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
router.post("/GetTasksByUserId", auth, (req, res) => {
  //login info
  const userId = req.body.userId;

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

//Update Status Task
router.get("/UpdateStatus/:id", auth, (req, res) => {
  // Id
  const id = req.params.id;
  const options = { new: true };

  Task.findById(id)
    .then((task) => {
      if (task == null) {
        const response = {
          message: "Task not found",
          isSuccess: false,
          data: null,
        };

        res.status(200).json(response);
      } else {
        // Update New Status
        task.status =
          task.status === StaticValue.TASK_STATUS_NEW
            ? StaticValue.TASK_STATUS_DONE
            : StaticValue.TASK_STATUS_NEW;

        // Update
        Task.findByIdAndUpdate(id, task, options)
          .then((responseData) => {
            if (responseData == null) {
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

//Update Type Task
router.get("/MarkImportant/:id", auth, (req, res) => {
  // Id
  const id = req.params.id;
  const options = { new: true };

  Task.findById(id)
    .then((task) => {
      if (task == null) {
        const response = {
          message: "Task not found",
          isSuccess: false,
          data: null,
        };

        res.status(200).json(response);
      } else {
        // Update Important
        task.isImportant = !task.isImportant;

        // Update
        Task.findByIdAndUpdate(id, task, options)
          .then((responseData) => {
            if (responseData == null) {
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

// Delete Task
router.delete("/DeleteTask/:id", auth, async (req, res) => {
  // Id
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

// Fake Delete Task
router.delete("/FakeDeleteTask/:id", auth, (req, res) => {
  // Id
  const id = req.params.id;
  const options = { new: true };

  Task.findById(id)
    .then((task) => {
      if (task == null) {
        const response = {
          message: "Task not found",
          isSuccess: false,
          data: null,
        };

        res.status(200).json(response);
      } else {
        // Update Important
        task.isDeleted = true;

        // Update
        Task.findByIdAndUpdate(id, task, options)
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

// Task Repeat
router.post("/CreateRepeat/", auth, async (req, res) => {
  const dataReq = {
    name: req.body.data.name,
    typeId: req.body.data.typeId,
    userId: req.body.data.userId,
    description: req.body.data.description,
    files: req.body.data.files,
    checkList: req.body.data.checkList,
    isImportant: req.body.data.isImportant,
    status: req.body.data.status,
    startTime: req.body.data.startTime,
    dueTime: req.body.data.dueTime,
    remindTime: req.body.data.remindTime,
    remindMode: req.body.data.remindMode,
    repeatTime: req.body.data.repeatTime,
    endRepeat: req.body.data.endRepeat,
    isRepeatedById: req.body.data.isRepeatedById,
    createdDate: req.body.data.createdDate,
  };
  const dates = req.body.datesRepeat;
  const data = new Task(dataReq);

  try {
    const dataToSave = await data.save();

    const response = {
      message: "Save Successfully",
      isSuccess: true,
      data: dataToSave,
    };

    // Repeat
    let created = 0;
    if (dates) {
      dates.forEach((element) => {
        const subData = new Task({
          ...dataReq,
          startTime: element.start,
          dueTime: element.end,
          isRepeatedById: dataToSave._id,
        });

        subData.save().then((res) => {
          if (res) {
            created++;
          }
        });
      });
    }

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

// Task Repeat after update
router.post("/CreateRepeatAfterUpdate/", auth, async (req, res) => {
  const dataReq = {
    // _id: req.body.data._id,
    name: req.body.data.name,
    typeId: req.body.data.typeId,
    userId: req.body.data.userId,
    description: req.body.data.description,
    files: req.body.data.files,
    checkList: req.body.data.checkList,
    isImportant: req.body.data.isImportant,
    status: req.body.data.status,
    startTime: req.body.data.startTime,
    dueTime: req.body.data.dueTime,
    remindTime: req.body.data.remindTime,
    remindMode: req.body.data.remindMode,
    repeatTime: req.body.data.repeatTime,
    endRepeat: req.body.data.endRepeat,
    // isRepeatedById: req.body.data.isRepeatedById,
    createdDate: req.body.data.createdDate,
  };

  const dataSaved = {
    ...dataReq,
    _id: req.body.data._id,
    isRepeatedById: req.body.data.isRepeatedById,
  };

  const dates = req.body.datesRepeat;

  try {
    // Repeat
    let created = 0;
    if (dates) {
      dates.forEach((element) => {
        const subData = new Task({
          ...dataReq,
          startTime: element.start,
          dueTime: element.end,
          isRepeatedById: dataSaved._id,
        });

        subData.save().then((res) => {
          if (res) {
            created++;
          }
        });
      });
    }

    const response = {
      message: "Save Successfully",
      isSuccess: true,
      data: {
        success: created,
      },
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
