const {
  clearAuthCookies,
  createSessionCookieFromIdToken,
  extractUserFromIdToken,
  extractUserFromSessionCookie,
} = require("../auth/middleware/user-validation-middleware");
const { createUser, getUser } = require("../../../services/users-service");
const express = require("express");
const router = express.Router();
const { getPostsByUserID } = require("../../../services/posts-service");
const {
  loginValidationFn,
  createUserValidationFn,
} = require("./users-validation");

const login = async (req, res, next) => {
  try {
    const { uid } = req;
    const user = await getUser(uid);
    res.status(200).json(user);
  } catch (err) {
    clearAuthCookies();
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
      clearAuthCookies();
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

router.get("/:id/posts", async (req, res, next) => {
  try {
    const post = await getPostsByUserID(req.params.id, req.query.sortType);
    res.json(post);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
