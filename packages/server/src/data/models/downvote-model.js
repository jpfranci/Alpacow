const VoterSchema = require("../schemas/voter-schema");
const mongoose = require("mongoose");

const Downvote = mongoose.model("Downvote", VoterSchema);

module.exports = Downvote;
