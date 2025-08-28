const express = require("express");
const {
  getAllVaccationTasks,
  getVaccationByID,
  addVaccationCategory,
  updateVaccations,
  deleteVaccation,
  cron,
} = require("../controllers/VaccationController");
const router = express.Router();

router.get("/", (req, res) => {
  getAllVaccationTasks(req, res);
});

router.get("/:id", (req, res) => {
  getVaccationByID(req, res);
});

router.post("/", (req, res) => {
  addVaccationCategory(req, res);
});

router.patch("/", (req, res) => {
  updateVaccations(req, res);
});

router.delete("/", (req, res) => {
  deleteVaccation(req, res);
});

router.get("/cron/", (req, res) => {
  cron(req, res);
});

module.exports = router;
