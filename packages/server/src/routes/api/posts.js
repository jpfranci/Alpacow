const express = require("express");
const router = express.Router();
const operations = require("../../data/db/db-operations/post-ops");

router.get("/", async function (req, res, next) {
  try {
    const posts = await operations.getPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
