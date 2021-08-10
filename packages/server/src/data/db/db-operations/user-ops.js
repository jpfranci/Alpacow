const User = require("../../models/user-model");

const getUser = async (userId) => {
  const users = await User.find({ _id: userId }).limit(1);
  return users[0];
};

const createUser = (payload) => {
  return User.create(payload);
};

const updateUser = ({ _id, username, email }) => {
  const updateResult = User.findByIdAndUpdate(
    _id,
    {
      username: username,
      email: email,
    },
    function (err, docs) {
      if (err) {
        return err;
      } else {
        return docs;
      }
    },
  );
  return updateResult;
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
  updateUser,
  doesUsernameExist,
  doesEmailExist,
};

module.exports = operations;
