import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import postService from "../../services/posts";
import { Location } from "./location-slice";

const prefix = "post";

export interface Post extends NewPost {
  id: string;
  upvotes: number;
  downvotes: number;
  createdAt: number;
  // comments: string[]
}

export type NewPost = {
  title: string;
  bodyText: string;
  tag: string;
  location: Location;
  userID: string;
};

export enum PostSortType {
  POPULAR = "popular",
  NEW = "new",
}

type PostState = {
  posts: Post[];
  sortType: PostSortType;
  locationFilter: Location;
  tagFilter?: string;
  currentPostID?: string;
};

const initialState: PostState = {
  posts: [],
  sortType: PostSortType.POPULAR,
  locationFilter: {
    name: "Vancouver",
    lat: 49.26,
    lon: -123.22,
  },
};

export const createPost = createAsyncThunk<Post, NewPost>(
  `${prefix}/createPost`,
  async (newPost, { rejectWithValue }) => {
    try {
      const response = await postService.create(newPost);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO add some filter param after deciding how post fetching will work (getting all posts will suffice for now)
export const getPosts = createAsyncThunk<Post[]>(
  `${prefix}/getPosts`,
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getAll();

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO vote actions have race condition, should be updating on server
export const upvote = createAsyncThunk<Partial<Post> & { id: string }, Post>(
  `${prefix}/upvote`,
  async (post, { rejectWithValue }) => {
    try {
      const response = await postService.update(post.id, {
        ...post,
        upvotes: post.upvotes + 1,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const downvote = createAsyncThunk<Partial<Post> & { id: string }, Post>(
  `${prefix}/downvote`,
  async (post, { rejectWithValue }) => {
    try {
      const response = await postService.update(post.id, {
        ...post,
        downvotes: post.downvotes + 1,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO implement getPostByID action
// TODO implement comment action

export const postSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {
    setSortType: (state, action: PayloadAction<PostSortType>) => {
      state.sortType = action.payload;
    },
    setLocationFilter: (state, action: PayloadAction<Location>) => {
      state.locationFilter = action.payload;
    },
    setTagFilter: (state, action: PayloadAction<string>) => {
      state.tagFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(upvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post.id === action.payload.id,
      );

      if (postToUpdate && action.payload.upvotes) {
        postToUpdate.upvotes = action.payload.upvotes;
      }
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post.id === action.payload.id,
      );

      if (postToUpdate && action.payload.downvotes) {
        postToUpdate.downvotes = action.payload.downvotes;
      }
    });
  },
});

export const { setSortType, setLocationFilter, setTagFilter } =
  postSlice.actions;
export default postSlice.reducer;
