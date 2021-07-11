const PostSchema = require("../schemas/post-schema");
const mongoose = require("mongoose");

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
