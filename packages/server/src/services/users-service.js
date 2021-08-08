const { BadRequestError } = require("../errors/bad-request-error");
const { AuthErrorCodes } = require("../errors/auth/auth-error-codes");

const UserDb = require("../data/db/db-operations/user-ops");
const PostDb = require("../data/db/db-operations/post-ops");
const admin = require("firebase-admin");

const tryToDeleteUser = async ({ _id }) => {
  try {
    await admin.auth().deleteUser(_id);
  } catch (err) {
    console.error("Error deleting user from firebase");
    console.error(err);
  }
};

const logout = (uid) => {
  return admin.auth().revokeRefreshTokens(uid);
};

const createUser = async (payload) => {
  try {
    return await UserDb.createUser({ ...payload, reputation: 0 });
  } catch (err) {
    if (err.code === 11000) {
      // try to delete the newly created user. this is since we would need to delete when:
      // a user is successfully created in firebase (email doesnt exist) but the username is already in our db
      // since firebase creation happens in the frontend, we can't do anything to guarantee atomicity
      await tryToDeleteUser(payload);
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

const getUser = async (uid) => {
  const user = await UserDb.getUser(uid);
  user.upvotedPostIds = await PostDb.getVotedPostIdsByUserID(uid, true);
  user.downvotedPostIds = await PostDb.getVotedPostIdsByUserID(uid, false);
  return user;
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
  logout,
};
