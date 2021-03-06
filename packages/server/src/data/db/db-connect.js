const mongoose = require("mongoose");
const querystring = require("querystring");
const {
  DB_NAME,
  MONGO_DB_PORT,
  MONGO_DB_HOST,
  MONGO_DB_USER,
  MONGO_DB_PASSWORD,
  MONGO_DB_PREFIX,
  USE_AUTHENTICATION,
  AUTH_SOURCE,
  ATLAS_URI,
  USE_ATLAS,
} = process.env;

const connectToDb = async () => {
  let uri;
  if (USE_ATLAS === "true") {
    uri = `${ATLAS_URI}`;
  } else {
    let authString = "";
    let queryParams = "";
    const encodedHost = encodeURIComponent(MONGO_DB_HOST);
    const encodedPort = encodeURIComponent(MONGO_DB_PORT ?? "");
    const encodedName = encodeURIComponent(DB_NAME);
    if (USE_AUTHENTICATION === "true") {
      const encodedUser = encodeURIComponent(MONGO_DB_USER);
      const encodedPass = encodeURIComponent(MONGO_DB_PASSWORD);
      authString = `${encodedUser}:${encodedPass}@`;
      const queryString = querystring.encode({ authSource: AUTH_SOURCE });
      queryParams = `?${queryString}`;
    }
    uri = `${MONGO_DB_PREFIX}://${authString}${encodedHost}:${encodedPort}/${encodedName}${queryParams}`;
  }
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const getDb = async () => {
  const db = await connectToDb();
  return db.connection;
};

module.exports.connectToDb = connectToDb;
module.exports.getDb = getDb;
