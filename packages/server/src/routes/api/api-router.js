/**
 * Base api router, add any middleware that is specific to api routes here
 */

const express = require("express");
const bodyParser = require("body-parser");
const nocache = require("nocache");
const postRouter = require("./posts/posts-router");
const tagsRouter = require("./tags/tags-router");
const usersRouter = require("./users/users-router");
const router = express.Router();

router.use(bodyParser.json());
router.use(nocache());
router.use("/posts", postRouter);
router.use("/tags", tagsRouter);
router.use("/users", usersRouter);

module.exports = router;
