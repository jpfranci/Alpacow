import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import postService from "../../services/posts";

const prefix = "posts";

export interface Post extends NewPost {
  id: string;
}

export type NewPost = {
  title: string;
  location: string; // TODO consider changing (maybe lat & lon)
  upvotes: number;
  downvotes: number;
  tag: string;
  userID: string;
  // reacts: sth[] // TODO stretch goal
  // createdAt: number; // TODO prob generate on backend
  // comments: string[] // TODO prob generate on backend
};

export type PartialPost = {
  [key in keyof NewPost]?: NewPost[key];
};

type PostState = {
  posts: Post[];
  currentPost?: Post;
};

const initialState: PostState = {
  posts: [],
};

// TODO add a filter param (getting all posts will suffice for now)
export const getPosts = createAsyncThunk(
  `${prefix}/signup`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getAll();

      return { posts: response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO implement getPostByID action
// TODO implement comment action
// TODO implement upvote action
// TODO implement downvote action

export const postSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload.posts;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      return { ...initialState };
    });
  },
});

// TODO fill if we ever get any synchronous actions
// export const {} = userSlice.actions;

export default postSlice.reducer;
