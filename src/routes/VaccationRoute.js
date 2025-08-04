const express = require("express");
const {
  getAllVaccationTasks,
  addVaccationTask,
  updateVaccationTask,
  deleteVaccationTask,
} = require("../controllers/VaccationController");
const router = express.Router();

router.get("/", (req, res) => {
  getAllVaccationTasks(req, res);
});

router.post("/", (req, res) => {
  addVaccationTask(req, res);
});

router.patch("/:id", (req, res) => {
  updateVaccationTask(req, res);
});

router.delete("/:id", (req, res) => {
  deleteVaccationTask(req, res);
});

module.exports = router;
