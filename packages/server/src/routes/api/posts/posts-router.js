const express = require("express");
const router = express.Router();
const {
  getPosts,
  createPost,
  getPostByID,
} = require("../../../services/posts-service");
const {
  createPostValidationFn,
  getPostValidationFn,
} = require("./posts-validation");

router.get("/", getPostValidationFn, async (req, res, next) => {
  try {
    const posts = await getPosts(req.query);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
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
    console.log(req.body);
    const createdPost = await createPost(req.body);
    res.json(createdPost);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
