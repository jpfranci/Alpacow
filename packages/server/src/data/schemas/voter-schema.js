const { Schema } = require("mongoose");
const {
  Types: { ObjectId },
} = Schema;

const VoterSchema = new Schema({
  userId: ObjectId,
  mediaId: ObjectId,
});

module.exports = VoterSchema;
