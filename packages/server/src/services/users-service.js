import { BadRequestError } from "../errors/bad-request-error";
import { AuthErrorCodes } from "../errors/auth/auth-error-codes";

const UserDb = require("../data/db/db-operations/user-ops");

const createUser = async (payload) => {
  try {
    return UserDb.createUser({ ...payload, reputation: 0 });
  } catch (err) {
    if (err.code === 11000) {
      const [isDuplicateEmail, isDuplicateUsername] = await Promise.all([
        UserDb.doesUsernameExist(payload.username),
        UserDb.doesEmailExist(payload.email),
      ]);
      if (isDuplicateEmail) {
        throw new BadRequestError(
          AuthErrorCodes.DUPLICATE_EMAIL,
          "Creation failed: email is already used",
        );
      } else if (isDuplicateUsername) {
        throw new BadRequestError(
          AuthErrorCodes.DUPLICATE_USERNAME,
          "Creation failed: username is already used",
        );
      } else {
        throw err;
      }
    }
  }
};

const getUser = (uid) => {
  return UserDb.getUser(uid);
};

module.exports = {
  createUser,
  getUser,
};
