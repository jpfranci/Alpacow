const csvParser = require("csv-parser");
const { ArgumentParser } = require("argparse");
const fs = require("fs");
const Chance = require("chance");
const { ObjectID } = require("mongodb");
const { MongoStarter } = require("./mongo_starter");

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
  }) {
    if (numUsers < 3) {
      throw Error("Number of users to generate must at least be 3");
    }
    this.postsPath = postsPath;
    this.locationPath = locationPath;
    this.commentsPath = commentsPath;
    this.tagsPath = tagsPath;
    this.numUsers = numUsers;
    this.maxComments = Math.min(numUsers, maxComments);
    this.users = [];
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
      const date = this.generateRandomDate(postObject.date.getTime());
      const { numUpvotes, numDownvotes } = this.generateVotes(score, commentId);

      postObject.comments.push({
        _id: new ObjectID(),
        body,
        date,
        numUpvotes,
        numDownvotes,
      });
    }
  }

  generateDataForPost(post) {
    const { title, score, body } = post;
    const date = this.generateRandomDate(this.startTime);
    const location = this.generateRandomLocation();
    const id = new ObjectID();
    const { element: tag } = this.getRandomElementFromArray(this.mockTags);
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
    };
    this.generateCommentsForPost(postObject);
    return postObject;
  }

  loadPostsCSV() {
    return new Promise((resolve) => {
      this.posts = [];
      fs.createReadStream(this.postsPath)
        .pipe(csvParser())
        .on("data", (post) => {
          this.posts.push(this.generateDataForPost(post));
        })
        .on("end", () => resolve());
    });
  }

  loadJSONData() {
    const rawLocations = fs.readFileSync(this.locationPath);
    this.mockLocations = JSON.parse(rawLocations);
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
      });
    }
  }

  async generate() {
    this.loadJSONData();
    this.generateUsers();
    await this.loadPostsCSV();
    console.log("");
  }
}

const parser = new ArgumentParser({
  add_help: true,
});
parser.add_argument("-p", "--posts", {
  default: "setup/mock-data/reddit_wsb.csv",
  help: "The path to the csv file containing the mock post data",
  dest: "postsPath",
});
parser.add_argument("-l", "--locations", {
  default: "setup/mock-data/location_bank.json",
  help: "The path to the json file containing mock latitude and longitude data",
  dest: "locationPath",
});
parser.add_argument("-c", "--comments", {
  default: "setup/mock-data/comments_bank.json",
  help: "The path to the json file containing mock comments data.",
  dest: "commentsPath",
});
parser.add_argument("-t", "--tags", {
  default: "setup/mock-data/tags_bank.json",
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

const args = parser.parse_args();

new DataGenerator({
  postsPath: args.postsPath,
  locationPath: args.locationPath,
  commentsPath: args.commentsPath,
  tagsPath: args.tagsPath,
  daysAgo: args.daysAgo,
  numUsers: args.numUsers,
  maxComments: args.maxComments,
})
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
