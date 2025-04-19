const express = require("express");
const { runChron1 } = require("../controllers/chronContoller");
const router = express.Router();

router.get("/", (req, res) => {
  runChron1(req, res);
});

module.exports = router;
