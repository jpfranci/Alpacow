const User = require("../../models/user-model");

const getUser = async (userId, fetchEmail = true) => {
  const projection = {
    username: true,
    reputation: true,
  };
  if (fetchEmail) {
    projection.email = true;
  }
  return User.findById(userId, projection);
};

const createUser = (payload) => {
  return User.create(payload);
};

const updateEmailAndUsername = ({ _id, username, email }) => {
  const updateObject = {};
  if (username) {
    updateObject.username = username;
  }
  if (email) {
    updateObject.email = email;
  }

  return User.findByIdAndUpdate(_id, updateObject, {
    new: true,
  });
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

const operations = {
  getUser,
  createUser,
  updateEmailAndUsername,
  doesUsernameExist,
  doesEmailExist,
};

module.exports = operations;
