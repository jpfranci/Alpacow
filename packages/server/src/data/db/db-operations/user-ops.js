const User = require("../../models/user-model");

const login = async (username, password) => {
  // TODO add real authentication
  return await User.find({ username: username });
};

const operations = {
  login,
};

module.exports = operations;
