const TagSchema = require("../schemas/tag-schema");
const mongoose = require("mongoose");

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
