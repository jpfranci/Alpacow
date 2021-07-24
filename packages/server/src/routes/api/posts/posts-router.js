const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  getPostByID,
} = require("../../../services/posts-service");
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

router.get("/:id", [nocache()], async (req, res, next) => {
  try {
    const post = await getPostByID(req.params.id);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

//TODO fix post creation validation after demo
router.post("/", async (req, res, next) => {
  try {
    const createdPost = await createPost(req.body.params);
    res.json(createdPost);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
