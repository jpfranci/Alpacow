const User = require("../../models/user-model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const login = async (username, password) => {
  // TODO add real authentication
  return await User.find({ username: username });
};

const userExists = async (userId) => {
  const userOpt = await User.find({ _id: ObjectId(userId) }).limit(1);
  return userOpt.length > 0;
};

const operations = {
  login,
  userExists,
};

module.exports = operations;
