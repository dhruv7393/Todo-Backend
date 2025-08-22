const express = require("express");
const { getAllVaccationTasks } = require("../controllers/VaccationController");
const router = express.Router();

router.get("/", (req, res) => {
  getAllVaccationTasks(req, res);
});

module.exports = router;
