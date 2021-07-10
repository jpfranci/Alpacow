require("dotenv").config();
const csvParser = require("csv-parser");
const Post = require("../src/data/models/post-model");
const Upvote = require("../src/data/models/upvote-model");
const Downvote = require("../src/data/models/downvote-model");
const User = require("../src/data/models/user-model");
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
    this.maxComments = Math.min(numUsers, maxComments);
    this.users = [];
    this.posts = [];
    this.upvotes = [];
    this.downvotes = [];
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
  generateVoters(eligibleVoters, mediaId, numVotes, votesArray) {
    for (let i = 0; i < numVotes; i++) {
      const { index: voterIndex } =
        this.getRandomElementFromArray(eligibleVoters);
      votesArray.push({
        userId: eligibleVoters[voterIndex]._id,
        mediaId,
      });

      eligibleVoters.splice(voterIndex, 1);
    }
  }

  generateVotes(score, id) {
    let numUpvotes;
    let numDownvotes;
    // Can't have more votes than number of users we have generated
    const scoreToUse = Math.min(
      Math.floor(Number(score)),
      Math.floor(this.users.length / 3),
    );
    if (scoreToUse > 0) {
      numUpvotes = chance.integer({
        min: scoreToUse,
        max: scoreToUse * 2,
      });
      numDownvotes = numUpvotes - scoreToUse;
    } else {
      numDownvotes = chance.integer({
        min: Math.abs(scoreToUse),
        max: Math.abs(scoreToUse) * 2,
      });
      numUpvotes = numDownvotes + scoreToUse;
    }

    const voters = [...this.users];
    this.generateVoters(voters, id, numUpvotes, this.upvotes);
    this.generateVoters(voters, id, numDownvotes, this.downvotes);
    return {
      numUpvotes: numUpvotes,
      numDownvotes: numDownvotes,
    };
  }

  generateCommentsForPost(postObject) {
    postObject.comments = [];
    const numComments = this.generateIntInRange(0, this.maxComments);
    for (let i = 0; i < numComments; i++) {
      const commentId = new ObjectID();
      const { element: commentToUse } = this.getRandomElementFromArray(
        this.mockComments,
      );
      const { body, score } = commentToUse;
      const poster = this.getRandomElementFromArray(this.users).element;
      poster.reputation += Math.floor(Number(score));
      const date = this.generateRandomDate(postObject.date.getTime());
      const { numUpvotes, numDownvotes } = this.generateVotes(score, commentId);

      postObject.comments.push({
        _id: new ObjectID(),
        body,
        date,
        numUpvotes,
        numDownvotes,
        userId: poster._id,
        username: poster.username,
      });
    }
  }

  generateDataForPost(post) {
    const { title, score, body } = post;
    const date = this.generateRandomDate(this.startTime);
    const location = this.generateRandomLocation();
    const id = new ObjectID();
    const { element: tag } = this.getRandomElementFromArray(this.mockTags);
    const poster = this.getRandomElementFromArray(this.users).element;
    poster.reputation += Math.floor(Number(score));
    const { numUpvotes, numDownvotes } = this.generateVotes(score, id);

    const postObject = {
      _id: id,
      title,
      numUpvotes,
      numDownvotes,
      body: body
        ? body
        : this.getRandomElementFromArray(this.mockComments).element.body,
      date,
      location,
      tag,
      userId: poster._id,
      username: poster.username,
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
        .on("end", () => {
          const postsToGenerate = Math.min(this.maxPosts, results.length);
          for (let i = 0; i < postsToGenerate; i++) {
            const { index } = this.getRandomElementFromArray(results);
            this.posts.push(this.generateDataForPost(results[index]));
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
      coordinates: [location.lat, location.lng],
    }));
    const rawComments = fs.readFileSync(this.commentsPath);
    this.mockComments = JSON.parse(rawComments);
    const rawTags = fs.readFileSync(this.tagsPath);
    this.mockTags = JSON.parse(rawTags);
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
    await Promise.all([
      Post.insertMany(this.posts),
      Upvote.insertMany(this.upvotes),
      Downvote.insertMany(this.downvotes),
      User.insertMany(this.users),
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
  help: `The maximum number of posts to generate`,
  dest: "maxPosts",
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
    mongoStarter.kill();
    process.exit(0);
  });
