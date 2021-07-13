require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const jsonServer = require("json-server");
const { connectToDb } = require("./data/db/db-connect");
const indexRouter = require("./routes");

const liveReloadServer = livereload.createServer({
  port: 35730,
});
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const db = connectToDb().connection;

const app = express();
app.use(connectLiveReload());
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/posts", indexRouter);

// TODO: eventually remove usage of mock-server
app.use("/api", jsonServer.router("mock-server/db.json"));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

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
