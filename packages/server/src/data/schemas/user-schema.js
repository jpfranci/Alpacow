const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: String,
  email: String,
  reputation: Number,
});

module.exports = UserSchema;
