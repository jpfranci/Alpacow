const User = require("../../models/user-model");

const getUser = async (userId) => {
  const users = await User.find({ _id: userId }).limit(1);
  return users[0];
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

const doesEmailExist = async (email) => {
  const userOpt = await User.find({
    email: email,
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
