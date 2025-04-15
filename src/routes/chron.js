const express = require("express");
const { runChron } = require("../controllers/chronContoller");
const router = express.Router();

router.get("/", (req, res) => {
  runChron(req, res);
});

module.exports = router;
