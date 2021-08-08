const express = require("express");
const router = express.Router();
const {
  extractUserFromSessionCookie,
} = require("../auth/middleware/user-validation-middleware");
const {
  getPosts,
  createPost,
  getPostByID,
} = require("../../../services/posts-service");
const {
  createPostValidationFn,
  getPostValidationFn,
} = require("./posts-validation");
const {
  upvotePost,
  downvotePost,
} = require("../../../data/db/db-operations/post-ops");

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
router.post(
  "/",
  [createPostValidationFn, extractUserFromSessionCookie],
  async (req, res, next) => {
    try {
      req.body.userId = req.uid;
      const createdPost = await createPost(req.body);
      res.json(createdPost);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/:id/upvote",
  [extractUserFromSessionCookie],
  async (req, res, next) => {
    try {
      const updatedPost = await upvotePost(req.params.id, req.uid);
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/:id/downvote",
  [extractUserFromSessionCookie],
  async (req, res, next) => {
    try {
      const updatedPost = await downvotePost(req.params.id, req.uid);
      res.json(updatedPost);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = router;
