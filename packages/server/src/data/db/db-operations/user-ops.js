const User = require("../../models/user-model");

const getUser = async (userId) => {
  const users = await User.find({ _id: userId }).limit(1);
  return users[0].toJSON(); // converts mongo model object to stripped down JSON containing only schema fields
};

const createUser = (payload) => {
  return User.create(payload);
};

const updateEmailAndUsername = ({ _id, username, email }) => {
  User.findByIdAndUpdate(
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
  return {
    username: username,
    email: email,
  };
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
