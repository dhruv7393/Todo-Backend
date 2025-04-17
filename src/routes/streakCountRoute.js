const express = require("express");
const router = express.Router();
const {
  getStreakCount,
  updateSincerityCount,
} = require("../controllers/streakCountController");

router.get("/", (req, res) => {
  getStreakCount(req, res);
});

router.post("/:id", (req, res) => {
  updateSincerityCount(req, res);
});

module.exports = router;
