const UserDb = require("../data/db/db-operations/user-ops");

const login = async (username, password) => {
  return UserDb.login(username, password);
};

module.exports = {
  login,
};
