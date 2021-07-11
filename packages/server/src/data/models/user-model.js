const UserSchema = require("../schemas/user-schema");
const mongoose = require("mongoose");

const User = mongoose.model("User", UserSchema);

module.exports = User;
