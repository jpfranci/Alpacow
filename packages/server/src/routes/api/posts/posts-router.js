const express = require("express");
const router = express.Router();
const { getPosts, createPost } = require("../../../services/posts-service");
const { createPostValidationFn } = require("./posts-validation");

router.get("/", async (req, res, next) => {
  try {
    const posts = await getPosts();
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.post("/", createPostValidationFn, async (req, res, next) => {
  try {
    const createdPost = await createPost(req.body);
    res.json(createdPost);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
