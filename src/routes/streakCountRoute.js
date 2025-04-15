const express = require("express");
const router = express.Router();
const { getStreakCount } = require("../controllers/streakCountController");

router.get("/", (req, res) => {
  getStreakCount(req, res);
});

module.exports = router;
