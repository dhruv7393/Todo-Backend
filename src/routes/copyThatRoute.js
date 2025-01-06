const express = require("express");
const {
  getCopyThat,
  updateAllCopyThatEveryDay,
  postCopyThat,
  patchCopyThat,
  deleteCopyThat,
  restart,
} = require("../controllers/copyThatController");
const router = express.Router();

router.get("/", (req, res) => {
  getCopyThat(req, res);
});

router.post("/", (req, res) => {
  postCopyThat(req, res);
});

router.post("/restart", (req, res) => {
  restart(req, res);
});

router.patch("/", (req, res) => [updateAllCopyThatEveryDay(req, res)]);

router.patch("/:id", (req, res) => [patchCopyThat(req, res)]);

router.delete("/:id", (req, res) => [deleteCopyThat(req, res)]);

module.exports = router;
