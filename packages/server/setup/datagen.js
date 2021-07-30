require("dotenv").config();
const csvParser = require("csv-parser");
const Post = require("../src/data/models/post-model");
const User = require("../src/data/models/user-model");
const Tag = require("../src/data/models/tag-model");
const { callAzureApi } = require("../src/services/posts-service");
const { ArgumentParser } = require("argparse");
const { connectToDb } = require("../src/data/db/db-connect");
const fs = require("fs");
const Chance = require("chance");
const { MongoStarter } = require("./mongo-starter");
const mongoose = require("mongoose");

const {
  mongo: { ObjectID },
} = mongoose;
const mongoStarter = new MongoStarter();
mongoStarter.start();
const chance = new Chance();

class DataGenerator {
  constructor({
    postsPath,
    locationPath,
    commentsPath,
    tagsPath,
    daysAgo,
    numUsers,
    maxComments,
    maxPosts,
    reset,
    maxScore,
    callAzure,
  }) {
    if (numUsers < 3) {
      throw Error("Number of users to generate must at least be 3");
    }
    this.postsPath = postsPath;
    this.locationPath = locationPath;
    this.commentsPath = commentsPath;
    this.tagsPath = tagsPath;
    this.maxPosts = maxPosts;
    this.reset = reset;
    this.numUsers = numUsers;
    this.maxScore = maxScore;
    this.maxComments = Math.min(numUsers, maxComments);
    this.users = [];
    this.posts = [];
    this.setDayRange(daysAgo);
    this.callAzure = callAzure;
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

  getRandomElementFromArray(arr) {
    const index = chance.integer({ min: 0, max: arr.length - 1 });
    return {
      index,
      element: arr[index],
    };
  }

  generateRandomDate(startTime) {
    const randomMillis = chance.integer({
      min: startTime,
      max: this.currentTime,
    });
    return new Date(randomMillis);
  }

  generateRandomLocation() {
    return this.getRandomElementFromArray(this.mockLocations).element;
  }

  // Generate votes by sampling the pool of voters without replacement
  generateVoters(eligibleVoters, numVotes, votesArray) {
    for (let i = 0; i < numVotes; i++) {
      const { index: voterIndex } =
        this.getRandomElementFromArray(eligibleVoters);
      votesArray.push(eligibleVoters[voterIndex]._id);

      eligibleVoters.splice(voterIndex, 1);
    }
  }

  generateVotes(score) {
    let numUpvotes;
    let numDownvotes;
    // Can't have more votes than number of users we have generated
    const scoreToUse = Math.min(
      Math.abs(Math.floor(Number(score))),
      Math.floor(this.users.length / 3),
      this.maxScore,
    );
    if (score > 0) {
      numUpvotes = chance.integer({
        min: scoreToUse,
        max: scoreToUse * 2,
      });
      numDownvotes = numUpvotes - scoreToUse;
    } else {
      numDownvotes = chance.integer({
        min: scoreToUse,
        max: scoreToUse * 2,
      });
      numUpvotes = numDownvotes - scoreToUse;
    }

    const voters = [...this.users];
    const upvoters = [];
    const downvoters = [];
    this.generateVoters(voters, numUpvotes, upvoters);
    this.generateVoters(voters, numDownvotes, downvoters);
    return {
      numUpvotes,
      numDownvotes,
      upvoters,
      downvoters,
    };
  }

  generateCommentsForPost(postObject) {
    postObject.comments = [];
    const numComments = this.generateIntInRange(0, this.maxComments);
    for (let i = 0; i < numComments; i++) {
      const { element: commentToUse } = this.getRandomElementFromArray(
        this.mockComments,
      );
      const { body, score } = commentToUse;
      const poster = this.getRandomElementFromArray(this.users).element;
      poster.reputation += Math.floor(Number(score));
      const date = this.generateRandomDate(postObject.date.getTime());
      const votes = this.generateVotes(score);

      postObject.comments.push({
        body,
        date,
        userId: poster._id,
        username: poster.username,
        ...votes,
      });
    }
  }

  async checkIsMature(text) {
    let isMature = false;
    const textLengthLimit = 1024;
    const timeout = 10000;

    for (let i = 0; i < text.length; i += textLengthLimit) {
      const textModResponse = await callAzureApi(
        text.substring(i, Math.min(i + textLengthLimit, text.length)),
      );
      isMature =
        isMature || textModResponse.data.Classification.ReviewRecommended;
      if (isMature) break;
      await setTimeout(() => {}, timeout);
    }
    return isMature;
  }

  async generateDataForPost(post) {
    const { title, score, body } = post;
    const date = this.generateRandomDate(this.startTime);
    const location = this.generateRandomLocation();
    const {
      element: { tag },
    } = this.getRandomElementFromArray(this.mockTags);
    const poster = this.getRandomElementFromArray(this.users).element;
    poster.reputation += Math.floor(Number(score));
    const votes = this.generateVotes(score);

    const isMature = this.callAzure
      ? (await this.checkIsMature(title)) || (await this.checkIsMature(body))
      : false;

    const postObject = {
      title,
      ...votes,
      body: body
        ? body
        : this.getRandomElementFromArray(this.mockComments).element.body,
      date,
      location,
      tag,
      userId: poster._id,
      username: poster.username,
      isMature: isMature,
    };
    this.generateCommentsForPost(postObject);
    return postObject;
  }

  loadPostsCSV() {
    return new Promise((resolve) => {
      const results = [];
      fs.createReadStream(this.postsPath)
        .pipe(csvParser())
        .on("data", (post) => {
          results.push(post);
        })
        .on("end", async () => {
          const postsToGenerate = Math.min(this.maxPosts, results.length);
          for (let i = 0; i < postsToGenerate; i++) {
            const { index } = this.getRandomElementFromArray(results);
            const post = await this.generateDataForPost(results[index]);
            this.posts.push(post);
            results.splice(index, 1);
          }
          resolve();
        });
    });
  }

  loadJSONData() {
    const rawLocations = fs.readFileSync(this.locationPath);
    this.mockLocations = JSON.parse(rawLocations).map((location) => ({
      type: "Point",
      coordinates: [location.lng, location.lat],
    }));
    const rawComments = fs.readFileSync(this.commentsPath);
    this.mockComments = JSON.parse(rawComments);
    const rawTags = fs.readFileSync(this.tagsPath);
    this.mockTags = JSON.parse(rawTags).map((tag) => ({
      tag,
    }));
  }

  generateUsers() {
    for (let i = 0; i < this.numUsers; i++) {
      this.users.push({
        _id: new ObjectID(),
        username: chance.word({ length: 10 }),
        email: chance.email(),
        reputation: 0,
      });
    }
  }

  async generate() {
    this.loadJSONData();
    this.generateUsers();
    await this.loadPostsCSV();
    await connectToDb();
    if (this.reset) {
      await mongoose.connection.db.dropDatabase();
    }
    await Tag.deleteMany({
      tag: {
        $in: [...this.mockTags.map(({ tag }) => tag)],
      },
    });
    await Promise.all([
      Post.insertMany(this.posts),
      User.insertMany(this.users),
      Tag.insertMany(this.mockTags, { ordered: false }),
    ]);
  }
}

const parser = new ArgumentParser({
  add_help: true,
});
parser.add_argument("-p", "--posts", {
  default: `${__dirname}/mock-data/reddit_wsb.csv`,
  help: "The path to the csv file containing the mock post data",
  dest: "postsPath",
});
parser.add_argument("-l", "--locations", {
  default: `${__dirname}/mock-data/location_bank.json`,
  help: "The path to the json file containing mock latitude and longitude data",
  dest: "locationPath",
});
parser.add_argument("-c", "--comments", {
  default: `${__dirname}/mock-data/comments_bank.json`,
  help: "The path to the json file containing mock comments data.",
  dest: "commentsPath",
});
parser.add_argument("-t", "--tags", {
  default: `${__dirname}/mock-data/tags_bank.json`,
  help: "The path to the json file containing mock tags data.",
  dest: "tagsPath",
});
parser.add_argument("-d", "--days", {
  default: 14,
  help: `The number of days back from today to start generating data for`,
  dest: "daysAgo",
  type: "int",
});
parser.add_argument("-u", "--num-users", {
  default: 100,
  help: `The number of users to generate.`,
  dest: "numUsers",
  type: "int",
});
parser.add_argument("--max-comments", {
  default: 50,
  help: `The maximum number of comments to generate per post`,
  dest: "maxComments",
  type: "int",
});
parser.add_argument("--max-posts", {
  default: 1000,
  help: `The maximum number of posts to generate`,
  dest: "maxPosts",
  type: "int",
});
parser.add_argument("-r", "--reset", {
  default: "false",
  help: `Whether to delete all existing data and reset.`,
  dest: "reset",
});
parser.add_argument("--max_score", {
  default: Infinity,
  help: "The absolute value of the maximum score that a post can have",
  dest: "maxScore",
  type: "int",
});
parser.add_argument("--call-azure", {
  default: "false",
  help: "Whether to call Azure text moderation api to set isMature on posts and comments",
  dest: "callAzure",
});

const args = parser.parse_args();

const dataGenerator = new DataGenerator({
  postsPath: args.postsPath,
  locationPath: args.locationPath,
  commentsPath: args.commentsPath,
  tagsPath: args.tagsPath,
  daysAgo: args.daysAgo,
  numUsers: args.numUsers,
  maxComments: args.maxComments,
  maxPosts: args.maxPosts,
  reset: args.reset === "true",
  maxScore: args.maxScore,
  callAzure: args.callAzure,
});
dataGenerator
  .generate()
  .then(() => {
    console.log("Done generating data");
  })
  .catch((e) => {
    console.log("An error occurred while generating data");
    console.log(e);
  })
  .finally(() => {
    process.exit(0);
  });
