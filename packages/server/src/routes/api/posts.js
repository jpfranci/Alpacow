const express = require("express");
const router = express.Router();
const operations = require("../../data/db/db-operations/post-ops");

router.get("/", async function (req, res, next) {
  const locationFilter = JSON.parse(req.query.locationFilter);
  let posts;
  try {
    if (req.query !== {}) {
      posts = await operations.getPostsByFilter(
        locationFilter.lon,
        locationFilter.lat,
        req.query.matureFilter,
      );
    } else {
      posts = await operations.getPosts();
    }
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    const response = await operations.createPost(
      req.body.params.title,
      req.body.params.body,
      req.body.params.tag,
      req.body.params.location,
      req.body.params.userId,
    );
    res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
