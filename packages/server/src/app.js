require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const { getDb } = require("./data/db/db-connect");
const { errors } = require("celebrate");
const apiRouter = require("./routes/api/api-router");

getDb()
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.log("uh oh bad db", err);
  });

const liveReloadServer = livereload.createServer({
  port: 35730,
});
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const app = express();
app.on("ready", function () {
  app.listen();
});
app.use(connectLiveReload());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errors());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
