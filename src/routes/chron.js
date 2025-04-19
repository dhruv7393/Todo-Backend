const express = require("express");
const { runChronForStreak } = require("../controllers/chronContoller");
const router = express.Router();

router.get("/", (req, res) => {
  runChronForStreak(req, res);
});

module.exports = router;
