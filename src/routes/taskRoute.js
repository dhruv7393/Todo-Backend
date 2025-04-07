const express = require("express");
const {
  getTasks,
  postTasks,
  postDailyUpdate,
  deleteTask,
  patchTask,
} = require("../controllers/TaskController");
const router = express.Router();

router.get("/", (req, res) => {
  getTasks(req, res);
});

router.post("/", (req, res) => {
  postTasks(req, res);
});

router.post("/postdailyupdate", (req, res) => {
  postDailyUpdate(req, res);
});

router.patch("/:id", (req, res) => [patchTask(req, res)]);

router.delete("/:id", (req, res) => [deleteTask(req, res)]);

module.exports = router;
