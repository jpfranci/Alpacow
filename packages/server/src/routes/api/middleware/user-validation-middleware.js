const admin = require("firebase-admin");
const FIREBASE_COOKIE_NAME = "firebase-session";

const extractUserFromIdToken = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.uid = decodedToken.uid;
    next();
  } catch {
    res.status(401).send("Invalid id token");
  }
};

const extractUserFromSessionToken = async (req, res, next) => {
  try {
    const firebaseSessionCookie = req.cookies[FIREBASE_COOKIE_NAME] ?? "";
  } catch (err) {
    res.status(401).send("Unauthorized request");
  }
};
