const express = require("express");
const {
  getAllVaccationTasks,
  getVaccationByID,
  addVaccationCategory,
  updateVaccations,
  deleteVaccation,
  chron,
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

router.delete("/:id", (req, res) => {
  deleteVaccation(req, res);
});

router.get("/chron", (req, res) => {
  chron(req, res);
});

module.exports = router;
