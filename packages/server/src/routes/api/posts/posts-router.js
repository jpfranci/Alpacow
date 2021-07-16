const express = require("express");
const router = express.Router();
const { getPosts, createPost } = require("../../../services/posts-service");
const nocache = require("nocache");
const {
  createPostValidationFn,
  getPostValidationFn,
} = require("./posts-validation");

router.get("/", [getPostValidationFn, nocache()], async (req, res, next) => {
  try {
    const posts = await getPosts(req.query);
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
