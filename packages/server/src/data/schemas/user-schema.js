const { Schema } = require("mongoose");

const UserSchema = new Schema({
  _id: String,
  username: { type: String, index: true, unique: true },
  email: { type: String, index: true, unique: true },
  reputation: Number,
});

module.exports = UserSchema;
