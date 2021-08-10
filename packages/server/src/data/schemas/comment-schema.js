const { Schema } = require("mongoose");

const CommentSchema = new Schema({
  body: String,
  date: Date,
  userId: String,
  username: String,
  upvoters: { type: [String], index: true },
  downvoters: { type: [String], index: true },
  isMature: Boolean,
});

module.exports = CommentSchema;
