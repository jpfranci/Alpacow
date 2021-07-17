const PostDb = require("../data/db/db-operations/post-ops");
const TagDb = require("../data/db/db-operations/tag-ops");
require("dotenv").config();
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

const createPost = async (post) => {
  const { tag, lat, lon } = post;
  const doesTagExist = await TagDb.tagExists(tag);
  if (!doesTagExist) {
    try {
      await TagDb.createTag(tag);
    } catch (err) {
      if (err.code === 11000) {
        // ignore the tag has already been created
      }
    }
  }

  const isMature = await checkIsMature(post.title, post.body);

  const postToInsert = {
    ...post,
    date: new Date(),
    numUpvotes: 0,
    numDownvotes: 0,
    upvoters: [],
    downvoters: [],
    comments: [],
    location: {
      type: "Point",
      coordinates: [lon, lat],
    },
    isMature: isMature,
  };

  return PostDb.createPost(postToInsert);
};

const getPosts = (query) => {
  return PostDb.getPostsByFilter(query);
};

module.exports = {
  createPost,
  getPosts,
};
