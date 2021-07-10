const csvParser = require("csv-parser");
const { ArgumentParser } = require("argparse");
const fs = require("fs");
const Chance = require("chance");
const { ObjectID } = require("mongodb");

const chance = new Chance();

class DataGenerator {
  constructor({ postsPath, locationPath, commentsPath, daysAgo, numUsers }) {
    this.postsPath = postsPath;
    this.locationPath = locationPath;
    this.commentsPath = commentsPath;
    this.numUsers = numUsers;
    this.users = [];
    this.setDayRange(daysAgo);
  }

  setDayRange(daysAgo) {
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - daysAgo);
    this.currentTime = currentDate.getTime();
    this.startTime = startDate.getTime();
  }

  // generates a number between start (inclusive) and end (inclusive)
  generateIntInRange(start, end) {
    return chance.integer({ min: start, max: end });
  }

  generateRandomDate() {
    const randomMillis = this.generateIntInRange(
      this.startTime,
      this.currentTime,
    );
    return new Date(randomMillis);
  }

  generateRandomLocation() {
    const index = this.generateIntInRange(0, this.locations.length - 1);
    return this.locations[index];
  }

  generateVotes() {}

  loadPostsCSV() {
    return new Promise((resolve) => {
      const results = [];
      fs.createReadStream(this.postsPath)
        .pipe(csvParser())
        .on("data", (post) => {
          const { title, score, body } = post;
          const date = this.generateRandomDate();
          const location = this.generateRandomLocation();
          const id = new ObjectID();
          results.push({
            _id: id,
            title,
            score,
            body: body ? body : chance.sentence({ words: 5 }),
            date,
            location,
          });
        })
        .on("end", () => resolve(results));
    });
  }

  loadJSONData() {
    const rawLocations = fs.readFileSync(this.locationPath);
    this.locations = JSON.parse(rawLocations);
    const rawComments = fs.readFileSync(this.commentsPath);
    this.comments = JSON.parse(rawComments);
  }

  generateUsers() {
    for (let i = 0; i < this.numUsers; i++) {
      this.users.push({
        _id: new ObjectID(),
        username: chance.word({ length: 10 }),
        email: chance.email(),
      });
    }
  }

  async generate() {
    this.loadJSONData();
    this.generateUsers();
    const mockPosts = await this.loadPostsCSV();
    console.log(mockPosts[0]);
  }
}

const parser = new ArgumentParser({
  add_help: true,
});
parser.add_argument("-p", "--posts", {
  default: "mock-data/reddit_wsb.csv",
  help: "The path to the csv file containing the mock post data",
  dest: "postsPath",
});
parser.add_argument("-l", "--locations", {
  default: "mock-data/location_bank.json",
  help: "The path to the json file containing mock latitude and longitude data",
  dest: "locationPath",
});
parser.add_argument("-c", "--comments", {
  default: "mock-data/comments_bank.json",
  help: "The path to the json file containing mock comments data.",
  dest: "commentsPath",
});
parser.add_argument("-d", "--days", {
  default: 14,
  help: `The number of days back from today to start generating data for`,
  dest: "days",
  type: "int",
});
parser.add_argument("-u", "--num-users", {
  default: 100,
  help: `The number of users to generate.`,
  dest: "numUsers",
  type: "int",
});

const args = parser.parse_args();

new DataGenerator({
  postsPath: args.postsPath,
  locationPath: args.locationPath,
  commentsPath: args.commentsPath,
  days: args.days,
  numUsers: args.numUsers,
})
  .generate()
  .then(() => {
    console.log("Done generating data");
  })
  .catch((e) => {
    console.log("An error occurred while generating data");
    console.log(e);
  });
