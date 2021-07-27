import {
  DEFAULT_SESSION_COOKIE_EXPIRATION,
  FIREBASE_SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  USERNAME_COOKIE_NAME,
} from "../auth-constants";

const admin = require("firebase-admin");

const handleBadIdToken = (err, res) => {
  switch (err.code) {
    // TODO wrap server codes in error messages, so client can handle
    case "auth/id-token-expired":
    case "auth/session-cookie-revoked":
      return res.status(400).send("Token expired, please try again.");
    default:
      return res.status(401).send("Unauthorized request");
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie(FIREBASE_SESSION_COOKIE_NAME);
  res.clearCookie(USERNAME_COOKIE_NAME);
};

const extractUserFromIdToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    clearAuthCookies(res);
    handleBadIdToken(err, res);
  }
};

const extractUserFromSessionCookie = async (req, res, next) => {
  try {
    // TODO CRSF validation
    const firebaseSessionCookie =
      req.cookies[FIREBASE_SESSION_COOKIE_NAME] ?? "";
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(firebaseSessionCookie);
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    clearAuthCookies(res);
    switch (err.code) {
      case "auth/session-cookie-expired":
      case "auth/session-cookie-revoked":
        return res.status(400).send("Session expired, please login again.");
      default:
        return res.status(401).send("Unauthorized request");
    }
  }
};

const createSessionCookieFromIdToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: DEFAULT_SESSION_COOKIE_EXPIRATION,
    });
    res.cookie(
      FIREBASE_SESSION_COOKIE_NAME,
      sessionCookie,
      SESSION_COOKIE_OPTIONS,
    );
    next();
  } catch (err) {
    clearAuthCookies(res);
    handleBadIdToken(err, res);
  }
};

module.exports = {
  extractUserFromIdToken,
  extractUserFromSessionCookie,
  createSessionCookieFromIdToken,
  clearAuthCookies,
};
