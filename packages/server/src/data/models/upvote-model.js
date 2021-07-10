const VoterSchema = require("../schemas/voter-schema");
const mongoose = require("mongoose");

const Upvote = mongoose.model("Upvote", VoterSchema);

module.exports = Upvote;
