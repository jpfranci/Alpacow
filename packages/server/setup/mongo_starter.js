require("dotenv").config();
const { spawn } = require("child_process");
const { exec } = require("shelljs");

class MongoStarter {
  start() {
    if (process.env.START_MONGO_DB === "true") {
      const { USE_AUTHENTICATION, MONGO_DB_PATH, MONGO_DB_PORT } = process.env;
      const command = `mongod ${
        USE_AUTHENTICATION ? "--auth" : ""
      } --port ${MONGO_DB_PORT} --dbpath ${MONGO_DB_PATH}`;
      this.child = exec(command, { async: true });
    }
  }

  kill() {
    exec("kill -2 `pgrep mongod`");
    this.child.kill();
  }
}

module.exports.MongoStarter = MongoStarter;
