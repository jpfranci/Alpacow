const mongoose = require("mongoose");
const querystring = require("querystring");
const {
  DB_NAME,
  MONGO_DB_PORT,
  MONGO_DB_HOST,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  USE_AUTHENTICATION,
  AUTH_SOURCE,
} = process.env;

const connectToDb = () => {
  let authString = "";
  let queryParams = "";
  const encodedHost = encodeURIComponent(MONGO_DB_HOST);
  const encodedPort = encodeURIComponent(MONGO_DB_PORT);
  const encodedName = encodeURIComponent(DB_NAME);
  if (USE_AUTHENTICATION === "true") {
    const encodedUser = encodeURIComponent(MONGO_DB_USER);
    const encodedPass = encodeURIComponent(MONGO_DB_PASSWORD);
    authString = `${encodedUser}:${encodedPass}@`;
    const queryString = querystring.encode({ authSource: AUTH_SOURCE });
    queryParams = `?${queryString}`;
  }
  return mongoose.connect(
    `mongodb://${authString}${encodedHost}:${encodedPort}/${encodedName}${queryParams}`,
    { useNewUrlParser: true },
  );
};

module.exports.connectToDb = connectToDb;
