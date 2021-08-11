import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import postService from "../../services/posts";
import { RootState } from "../store";
import { updateUser } from "./user-slice";

const prefix = "post";

export type Location = {
  name?: string;
  lat: number;
  lon: number;
};

export const initialLocation: Location = {
  name: undefined,
  lat: 49.26,
  lon: -123.22,
};

export interface NewComment {
  body: string;
}

export type Comment = {
  _id: string;
  date: string;
  numUpvotes: number;
  numDownvotes: number;
  userId: string;
  username: string;
  body: string;
};

export interface Post extends NewPost {
  _id: string;
  numUpvotes: number;
  numDownvotes: number;
  date: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  username: string;
  comments?: Comment[]; // optional b/c posts fetched on home page don't have comments
}

export interface NewPost {
  title: string;
  body: string;
  tag: string;
  location: Location;
  isAnonymous: boolean;
}

export enum PostSortType {
  POPULAR = "popular",
  NEW = "new",
}

export enum CommentSortType {
  POPULAR = "popular",
  NEW = "new",
}

export type PostState = {
  posts: Post[];
  sortType: PostSortType;
  commentSortType: CommentSortType;
  locationFilter: Location;
  tagFilter?: string;
  currentPostID?: string;
  tagInput: string;
  showMatureContent?: boolean;
  currPostIndex: number;
};

let locationFilter: Location = initialLocation;

const initialState: PostState = {
  posts: [],
  sortType: PostSortType.POPULAR,
  commentSortType: CommentSortType.NEW,
  locationFilter: locationFilter,
  tagInput: "",
  showMatureContent: false,
  currPostIndex: -1,
};

export const createPost = createAsyncThunk<
  Post[],
  NewPost,
  { state: RootState }
>(`${prefix}/createPost`, async (newPost, { rejectWithValue, getState }) => {
  try {
    const postState = getState().post;
    await postService.create(newPost);
    return await postService.getPostsByFilter(postState);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const getPosts = createAsyncThunk<Post[]>(
  `${prefix}/getPosts`,
  async (_, { rejectWithValue }) => {
    try {
      return await postService.getAll();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const getPostsByFilter = createAsyncThunk<Post[], PostState>(
  `${prefix}/getPostsByFilter`,
  async (postState: PostState, { rejectWithValue }) => {
    try {
      return await postService.getPostsByFilter(postState);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const upvote = createAsyncThunk<
  {
    numUpvotes: number;
    numDownvotes: number;
    postId: string;
    isUpvoted: boolean;
    isDownvoted: boolean;
  },
  { post: Post }
>(`${prefix}/upvote`, async ({ post }, { rejectWithValue }) => {
  try {
    const response = await postService.upvote(post._id);
    return {
      numUpvotes: response.numUpvotes,
      numDownvotes: response.numDownvotes,
      isUpvoted: response.isUpvoted,
      isDownvoted: response.isDownvoted,
      postId: post._id,
    };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const downvote = createAsyncThunk<
  {
    numUpvotes: number;
    numDownvotes: number;
    postId: string;
    isUpvoted: boolean;
    isDownvoted: boolean;
  },
  { post: Post }
>(`${prefix}/downvote`, async ({ post }, { rejectWithValue }) => {
  try {
    const response = await postService.downvote(post._id);
    return {
      numUpvotes: response.numUpvotes,
      numDownvotes: response.numDownvotes,
      isUpvoted: response.isUpvoted,
      isDownvoted: response.isDownvoted,
      postId: post._id,
    };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const createComment = createAsyncThunk<
  any,
  { newComment: NewComment; postId: string }
>(
  `${prefix}/createComment`,
  async ({ newComment, postId }, { rejectWithValue }) => {
    try {
      const response = await postService.createComment(newComment, postId);
      console.log(response.data);
      return {
        postId,
        comment: response.data,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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
      state.tagInput = action.payload;
    },
    setTagInput: (state, action: PayloadAction<string>) => {
      state.tagInput = action.payload;
    },
    setShowMatureContent: (state, action: PayloadAction<boolean>) => {
      state.showMatureContent = action.payload;
    },
    setCurrPostIndex: (state, action: PayloadAction<number>) => {
      state.currPostIndex = action.payload;
    },
    setCommentSortType: (state, action: PayloadAction<CommentSortType>) => {
      state.commentSortType = action.payload;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload._id,
      );

      if (postToUpdate) {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post,
        );
      } else {
        // this case solely exists to handle workflow where user navs to single post view via url
        state.posts = [action.payload];
        state.currPostIndex = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPosts.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(getPosts.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(getPostsByFilter.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(getPostsByFilter.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(upvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload.postId,
      );

      if (postToUpdate) {
        // we update both in case user is upvoting a post that they previously downvoted
        postToUpdate.numUpvotes = action.payload.numUpvotes;
        postToUpdate.numDownvotes = action.payload.numDownvotes;
        postToUpdate.isUpvoted = action.payload.isUpvoted;
        postToUpdate.isDownvoted = action.payload.isDownvoted;
      }
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload.postId,
      );

      if (postToUpdate) {
        postToUpdate.numUpvotes = action.payload.numUpvotes;
        postToUpdate.numDownvotes = action.payload.numDownvotes;
        postToUpdate.isUpvoted = action.payload.isUpvoted;
        postToUpdate.isDownvoted = action.payload.isDownvoted;
      }
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload.postId,
      );

      if (postToUpdate) {
        postToUpdate.comments?.unshift(action.payload.comment);
      }
    });
  },
});

export const {
  setSortType,
  setLocationFilter,
  setTagFilter,
  setTagInput,
  setShowMatureContent,
  setCurrPostIndex,
  setCommentSortType,
  updatePost,
} = postSlice.actions;
export default postSlice.reducer;
