const {
  clearAuthCookies,
  createSessionCookieFromIdToken,
  extractUserFromIdToken,
  extractUserFromSessionCookie,
} = require("../auth/middleware/user-validation-middleware");
const {
  createUser,
  getUser,
  validateEmailAndUsername,
  logout,
} = require("../../../services/users-service");
const express = require("express");
const router = express.Router();
const { getPostsByUserID } = require("../../../services/posts-service");
const {
  loginValidationFn,
  createUserValidationFn,
  emailAndUsernameValidationFn,
} = require("./users-validation");

const login = async (req, res, next) => {
  try {
    const { uid } = req;
    const user = await getUser(uid);
    res.status(200).json(user);
  } catch (err) {
    clearAuthCookies(res);
    next(err);
  }
};

router.post(
  "/",
  [
    createUserValidationFn,
    extractUserFromIdToken,
    createSessionCookieFromIdToken,
  ],
  async (req, res, next) => {
    try {
      const { uid } = req;
      const payload = req.body;
      const createdUser = await createUser({
        ...payload,
        _id: uid,
      });
      res.status(201).json(createdUser);
    } catch (err) {
      clearAuthCookies(res);
      next(err);
    }
  },
);

router.post(
  "/validate",
  [emailAndUsernameValidationFn],
  async (req, res, next) => {
    try {
      const validationResults = await validateEmailAndUsername(req.body);
      res.status(200).send({ ...validationResults, emailExists: false });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/login",
  [loginValidationFn, extractUserFromIdToken, createSessionCookieFromIdToken],
  login,
);

router.post("/loginFromCookie", extractUserFromSessionCookie, login);
router.post("/logout", extractUserFromSessionCookie, async (req, res, next) => {
  try {
    const { uid } = req;
    await logout(uid);
    res.status(200).send();
  } catch (err) {
    next(err);
  } finally {
    clearAuthCookies(res);
  }
});

router.get("/:id/posts", async (req, res, next) => {
  try {
    const post = await getPostsByUserID(req.params.id, req.query.sortType);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
