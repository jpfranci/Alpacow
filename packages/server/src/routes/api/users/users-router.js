const express = require("express");
const router = express.Router();
const { login } = require("../../../services/users-service");
const { getPostsByUserID } = require("../../../services/posts-service");
const {
  loginValidationFn,
  createUserValidationFn,
} = require("./users-validation");
const admin = require("firebase-admin");
// 5 days
const DEFAULT_SESSION_COOKIE_EXPIRATION = 60 * 60 * 24 * 5 * 1000;
const SESSION_COOKIE_OPTIONS = {
  maxAge: DEFAULT_SESSION_COOKIE_EXPIRATION,
  httpOnly: true,
  secure: true,
};

const createSessionCookie = async (idToken, res) => {
  try {
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: DEFAULT_SESSION_COOKIE_EXPIRATION,
    });
    res.cookie("session", sessionCookie, SESSION_COOKIE_OPTIONS);
  } catch {
    res.status(401).send("Bad id token");
  }
};

router.post("/", createUserValidationFn, async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
});

router.post("/login", loginValidationFn, async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = decodedToken.uid;
    await createSessionCookie(idToken, res);
    res.json(currentUser);
  } catch (err) {
    next(err);
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
