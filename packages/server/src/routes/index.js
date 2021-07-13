const express = require("express");
const router = express.Router();
const operations = require("../data/db/db-operations");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("hello");
});

router.get("/api/posts", async function (req, res, next) {
  try {
    const posts = await operations.getPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
