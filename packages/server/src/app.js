require("dotenv").config();
const createError = require("http-errors");
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { getDb } = require("./data/db/db-connect");
const { errors } = require("celebrate");
const apiRouter = require("./routes/api/api-router");
const admin = require("firebase-admin");
const {
  httpsRedirect,
} = require("./routes/api/auth/middleware/https-middleware");
const { HttpError } = require("./errors/http-error");

// init firebase
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // need this b/c new lines in env variables don't play nice
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
});

getDb()
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.log("uh oh bad db", err);
  });

const app = express();
app.on("ready", function () {
  app.listen();
});

if (process.env.NODE_ENV === "development") {
  const livereload = require("livereload");
  const connectLiveReload = require("connect-livereload");

  const liveReloadServer = livereload.createServer({
    port: 35730,
  });
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });

  app.use(connectLiveReload());
}

app.use(express.static(path.join(__dirname, "..", "build")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(httpsRedirect);
app.use("/api", apiRouter);

// for heroku github action health checks
app.get("/health", (req, res) => {
  res.send("ok");
});

// Catch all routes for serving index.html. Ensures client side routing works.
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errors());

// error handler
app.use(function (err, req, res, next) {
  console.error(err);
  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      errorCode: err.errorCode,
    });
  } else {
    // mask any internal errors
    const messageToUse =
      process.env.NODE_ENV === "development"
        ? err.message
        : "An internal server error occurred";
    res.status(500).send(messageToUse);
  }
});

module.exports = app;
