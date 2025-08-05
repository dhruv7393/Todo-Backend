const express = require("express");
const {
  getAllVaccationTasks,
  addVaccationTask,
  updateVaccationTask,
  deleteVaccationTask,
  chron,
} = require("../controllers/VaccationController");
const router = express.Router();

router.get("/", (req, res) => {
  getAllVaccationTasks(req, res);
});

router.get("/chron", (req, res) => {
  chron(req, res);
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
