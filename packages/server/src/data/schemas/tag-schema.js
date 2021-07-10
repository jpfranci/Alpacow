const { Schema } = require("mongoose");

const TagSchema = new Schema({
  tag: {
    type: String,
    index: true,
    unique: true,
  },
});

module.exports = TagSchema;
