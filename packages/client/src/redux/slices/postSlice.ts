import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import postService from "../../services/posts";

const prefix = "post";

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

export enum PostSortType {
  POPULAR = "popular",
  NEW = "new",
}

type PostState = {
  posts: Post[];
  sortType: PostSortType;
  location: string;
  tagFilter?: string;
  currentPostID?: string;
};

const initialState: PostState = {
  posts: [],
  sortType: PostSortType.POPULAR,
  location: "vancouver",
};

// TODO decide if we want to do this here or in post slice (i.e. how do we want post feed to update?)
export const createPost = createAsyncThunk(
  `${prefix}/createPost`,
  async (newPost: NewPost, { rejectWithValue }) => {
    try {
      const response = await postService.create(newPost);

      return { post: response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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
  reducers: {
    setSortType: (state, action: PayloadAction<PostSortType>) => {
      state.sortType = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setTagFilter: (state, action: PayloadAction<string>) => {
      state.tagFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload.posts;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload.post);
    });
  },
});

export const { setSortType, setLocation, setTagFilter } = postSlice.actions;
export default postSlice.reducer;
