const express = require("express");
const router = express.Router();
const {
  getStreakCount,
  updateStreakCount,
} = require("../controllers/streakCountController");

router.get("/", (req, res) => {
  getStreakCount(req, res);
});

router.patch("/", (req, res) => {
  updateStreakCount(req, res);
});

module.exports = router;
