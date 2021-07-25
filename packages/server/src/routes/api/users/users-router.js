const express = require("express");
const router = express.Router();
const { login } = require("../../../services/users-service");
const { getPostsByUserID } = require("../../../services/posts-service");

router.get("/", async (req, res, next) => {
  try {
    const currentUser = await login(req.query.username, req.query.password);
    res.json(currentUser);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/posts", async (req, res, next) => {
  try {
    const post = await getPostsByUserID(req.params.id, req.query.sortType);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
