const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, index: true, unique: true },
  email: { type: String, index: true, unique: true },
  reputation: Number,
});

module.exports = UserSchema;
