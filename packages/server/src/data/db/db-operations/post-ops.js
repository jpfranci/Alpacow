require("dotenv").config();
const Post = require("../../models/post-model");
const axios = require("axios");

const callAzureApi = async (post) => {
  const headers = {
    "Content-Type": "text/plain",
    "Ocp-Apim-Subscription-Key": `${process.env.AZURE_API_KEY}`,
  };
  try {
    return await axios.post(
      "https://alpacow.cognitiveservices.azure.com/contentmoderator/moderate/v1.0/ProcessText/Screen?autocorrect=True&PII=True&classify=True&language=eng",
      `${post}`,
      { headers: headers },
    );
  } catch (err) {
    console.log(err.message);
    return {
      data: {
        Classification: {
          ReviewRecommended: true,
        },
      },
    };
  }
};

const checkIsMature = async (title, body) => {
  let isMature = false;

  const titleModResponse = await callAzureApi(title);
  isMature = isMature || titleModResponse.data.Classification.ReviewRecommended;
  await setTimeout(() => {}, 2000);

  const bodyModResponse = await callAzureApi(body);
  isMature = isMature || bodyModResponse.data.Classification.ReviewRecommended;
  await setTimeout(() => {}, 2000);

  return isMature;
};

// We don't want to send all 1000 posts to the client while we have no filters,
// so this will just sample randomly from all posts
const getPosts = async () => {
  return await Post.aggregate([{ $sample: { size: 50 } }]);
};

const getPostsByFilter = async (lon, lat, isMature) => {
  const matureFilter =
    isMature === "true"
      ? { $or: [{ isMature: true }, { isMature: false }] }
      : { isMature: false };
  return await Post.find({
    $and: [
      {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lon, lat],
            },
            $minDistance: 0,
            $maxDistance: 750,
          },
        },
      },
      matureFilter,
    ],
  });
};

const createPost = async (title, body, tag, location, userId) => {
  const isMature = await checkIsMature(title, body);
  const post = new Post({
    title: title,
    body: body,
    tag: tag,
    location: {
      type: "Point",
      coordinates: [location.lon, location.lat],
    },
    userId: userId,
    numUpvotes: 0,
    numDownvotes: 0,
    date: Date.now(),
    comments: [],
    isMature: isMature,
  });
  post.save();
  return post;
};

const operations = {
  getPosts,
  getPostsByFilter,
  createPost,
};

module.exports = operations;
