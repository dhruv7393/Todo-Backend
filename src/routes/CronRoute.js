const express = require("express");
const { cron } = require("../controllers/VaccationController");
const router = express.Router();

router.get("/", (req, res) => {
  cron(req, res);
});

module.exports = router;
