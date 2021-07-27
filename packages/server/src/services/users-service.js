const { BadRequestError } = require("../errors/bad-request-error");
const { AuthErrorCodes } = require("../errors/auth/auth-error-codes");

const UserDb = require("../data/db/db-operations/user-ops");

const createUser = async (payload) => {
  try {
    return await UserDb.createUser({ ...payload, reputation: 0 });
  } catch (err) {
    if (err.code === 11000) {
      const { usernameExists, emailExists } = await validateEmailAndUsername(
        payload,
      );
      if (emailExists) {
        throw new BadRequestError(
          AuthErrorCodes.DUPLICATE_EMAIL,
          "Creation failed: email is already used",
        );
      }

      if (usernameExists) {
        throw new BadRequestError(
          AuthErrorCodes.DUPLICATE_USERNAME,
          "Creation failed: username is already used",
        );
      }

      throw err;
    }
  }
};

const getUser = (uid) => {
  return UserDb.getUser(uid);
};

const validateEmailAndUsername = async ({ username, email }) => {
  const [usernameExists, emailExists] = await Promise.all([
    UserDb.doesUsernameExist(username),
    UserDb.doesEmailExist(email),
  ]);
  return {
    usernameExists,
    emailExists,
  };
};

module.exports = {
  createUser,
  getUser,
  validateEmailAndUsername,
};
