const User = require("../../models/user-model");

const getUser = (userId) => {
  return User.find({ _id: userId }).limit(1);
};

const createUser = (payload) => {
  return User.create(payload);
};

const doesUsernameExist = async (username) => {
  const userOpt = await User.find({
    username: username,
  }).limit(1);
  return userOpt.length > 0;
};

const doesEmailExist = async (username) => {
  const userOpt = await User.find({
    username: username,
  }).limit(1);
  return userOpt.length > 0;
};

const userExists = async (userId) => {
  const userOpt = await getUser(userId);
  return userOpt.length > 0;
};

const operations = {
  userExists,
  getUser,
  createUser,
  doesUsernameExist,
  doesEmailExist,
};

module.exports = operations;
