require("dotenv").config();
const { exec } = require("shelljs");

class MongoStarter {
  start() {
    if (process.env.START_MONGO_DB === "true") {
      const { USE_AUTHENTICATION, MONGO_DB_PATH, MONGO_DB_PORT } = process.env;
      const command = `mongod ${
        USE_AUTHENTICATION === "true" ? "--auth" : ""
      } --port ${MONGO_DB_PORT} --dbpath ${MONGO_DB_PATH}`;
      this.child = exec(command, { async: true, silent: true });
    }
  }

  kill() {
    if (this.child) {
      exec("kill -2 `pgrep mongod`");
      this.child.kill();
    }
  }
}

module.exports.MongoStarter = MongoStarter;
