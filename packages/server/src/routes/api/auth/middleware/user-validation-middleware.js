const {
  DEFAULT_SESSION_COOKIE_EXPIRATION,
  FIREBASE_SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
} = require("../auth-constants");
const admin = require("firebase-admin");
const { UnauthorizedError } = require("../../../../errors/unauthorized-error");
const { AuthErrorCodes } = require("../../../../errors/auth/auth-error-codes");

const handleBadIdToken = (err, res, next) => {
  switch (err.code) {
    // TODO wrap server codes in error messages, so client can handle
    case "auth/id-token-expired":
    case "auth/session-cookie-revoked":
      return next(
        new UnauthorizedError(
          AuthErrorCodes.TOKEN_EXPIRED,
          "Token expired, please try again.",
        ),
      );
    default:
      return next(
        new UnauthorizedError(
          AuthErrorCodes.INVALID_TOKEN,
          "Unauthorized request",
        ),
      );
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie(FIREBASE_SESSION_COOKIE_NAME);
};

const extractUserFromIdToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    clearAuthCookies(res);
    handleBadIdToken(err, res, next);
  }
};

const extractUserFromSessionCookie = async (req, res, next) => {
  try {
    // TODO CRSF validation
    const firebaseSessionCookie =
      req.cookies[FIREBASE_SESSION_COOKIE_NAME] ?? "";
    const decodedToken = await admin
      .auth()
      .verifySessionCookie(firebaseSessionCookie, true);
    req.uid = decodedToken.uid;
    next();
  } catch (err) {
    clearAuthCookies(res);
    switch (err.code) {
      case "auth/session-cookie-expired":
      case "auth/session-cookie-revoked":
        return next(
          new UnauthorizedError(
            AuthErrorCodes.SESSION_EXPIRED,
            "Session expired, please log in again.",
          ),
        );
      default:
        return next(
          new UnauthorizedError(
            AuthErrorCodes.INVALID_SESSION,
            "Unauthorized request",
          ),
        );
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
