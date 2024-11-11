const express = require("express");
const router = express.Router();
const {
  getCallHistory,
  toggleCall,
  postCall,
  getCallHistoryById,
  deleteCallById,
} = require("../controllers/callController");

router.get("/", (req, res) => {
  getCallHistory(req, res);
});

router.get("/:id", (req, res) => {
  getCallHistoryById(req, res);
});

router.patch("/:id", (req, res) => {
  toggleCall(req, res);
});

router.post("/", (req, res) => {
  postCall(req, res);
});

router.delete("/:id", (req, res) => {
  deleteCallById(req, res);
});

module.exports = router;
