import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import postService from "../../services/posts";
import { RootState } from "../store";

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

interface BaseComment {
  body: string;
}

export interface NewComment extends BaseComment {
  isAnonymous: boolean;
}

export interface Comment extends BaseComment {
  _id: string;
  date: string;
  numUpvotes: number;
  numDownvotes: number;
  userId: string;
  username: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  isMature: boolean;
}

export interface Post extends NewPost {
  _id: string;
  numUpvotes: number;
  numDownvotes: number;
  date: string;
  userId: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  username: string;
  comments?: Comment[]; // optional b/c posts fetched on home page don't have comments
  score: number;
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
  activePost?: Post;
};

let locationFilter: Location = initialLocation;

const initialState: PostState = {
  posts: [],
  sortType: PostSortType.POPULAR,
  commentSortType: CommentSortType.NEW,
  locationFilter: locationFilter,
  tagInput: "",
  showMatureContent: false,
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

export const getPostsByFilter = createAsyncThunk<
  Post[],
  void,
  { state: RootState }
>(`${prefix}/getPostsByFilter`, async (_, { rejectWithValue, getState }) => {
  try {
    return await postService.getPostsByFilter(getState().post);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const upvote = createAsyncThunk<
  {
    numUpvotes: number;
    numDownvotes: number;
    _id: string;
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
      _id: post._id,
    };
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const downvote = createAsyncThunk<
  {
    numUpvotes: number;
    numDownvotes: number;
    _id: string;
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
      _id: post._id,
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
      const comment = await postService.createComment(newComment, postId);
      return {
        postId,
        comment,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const upvoteComment = createAsyncThunk<
  {
    numUpvotes: number;
    numDownvotes: number;
    isUpvoted: boolean;
    isDownvoted: boolean;
    commentId: string;
  },
  { postId: string; commentId: string }
>(
  `${prefix}/upvoteComment`,
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await postService.upvoteComment(postId, commentId);
      return {
        numUpvotes: response.numUpvotes,
        numDownvotes: response.numDownvotes,
        isUpvoted: response.isUpvoted,
        isDownvoted: response.isDownvoted,
        commentId: commentId,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const downvoteComment = createAsyncThunk<
  {
    numUpvotes: number;
    numDownvotes: number;
    isUpvoted: boolean;
    isDownvoted: boolean;
    commentId: string;
  },
  { postId: string; commentId: string }
>(
  `${prefix}/downvoteComment`,
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      const response = await postService.downvoteComment(postId, commentId);
      return {
        numUpvotes: response.numUpvotes,
        numDownvotes: response.numDownvotes,
        isUpvoted: response.isUpvoted,
        isDownvoted: response.isDownvoted,
        commentId: commentId,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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
    setCommentSortType: (state, action: PayloadAction<CommentSortType>) => {
      state.commentSortType = action.payload;
    },
    updateActivePost: (state, action: PayloadAction<Post | undefined>) => {
      const postIndex = state.posts.findIndex(
        (post) => post._id === action.payload?._id,
      );

      if (postIndex !== -1) {
        state.posts[postIndex] = action.payload as Post;
        state.posts = [...state.posts];
      }

      state.activePost = action.payload;
    },
  },
  extraReducers: (builder) => {
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
        (post) => post._id === action.payload._id,
      );
      if (postToUpdate) {
        // we update both in case user is upvoting a post that they previously downvoted
        postToUpdate.numUpvotes = action.payload.numUpvotes;
        postToUpdate.numDownvotes = action.payload.numDownvotes;
        postToUpdate.isUpvoted = action.payload.isUpvoted;
        postToUpdate.isDownvoted = action.payload.isDownvoted;
      }
      if (state.activePost?._id === action.payload._id) {
        state.activePost = { ...state.activePost, ...action.payload };
      }
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      const postToUpdate = state.posts.find(
        (post) => post._id === action.payload._id,
      );
      if (postToUpdate) {
        postToUpdate.numUpvotes = action.payload.numUpvotes;
        postToUpdate.numDownvotes = action.payload.numDownvotes;
        postToUpdate.isUpvoted = action.payload.isUpvoted;
        postToUpdate.isDownvoted = action.payload.isDownvoted;
      }
      if (state.activePost?._id === action.payload._id) {
        state.activePost = { ...state.activePost, ...action.payload };
      }
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      const postToUpdate = state.activePost;

      if (postToUpdate) {
        if (!postToUpdate.comments) {
          postToUpdate.comments = [];
        }
        postToUpdate.comments.unshift(action.payload.comment);
      }
    });
    builder.addCase(upvoteComment.fulfilled, (state, action) => {
      const postToUpdate = state.activePost;
      if (postToUpdate) {
        const commentToUpdate = postToUpdate.comments?.find((comment) => {
          return comment._id === action.payload.commentId;
        });
        if (commentToUpdate) {
          commentToUpdate.numUpvotes = action.payload.numUpvotes;
          commentToUpdate.numDownvotes = action.payload.numDownvotes;
          commentToUpdate.isUpvoted = action.payload.isUpvoted;
          commentToUpdate.isDownvoted = action.payload.isDownvoted;
        }
      }
    });
    builder.addCase(downvoteComment.fulfilled, (state, action) => {
      const postToUpdate = state.activePost;
      if (postToUpdate) {
        const commentToUpdate = postToUpdate.comments?.find((comment) => {
          return comment._id === action.payload.commentId;
        });
        if (commentToUpdate) {
          commentToUpdate.numUpvotes = action.payload.numUpvotes;
          commentToUpdate.numDownvotes = action.payload.numDownvotes;
          commentToUpdate.isUpvoted = action.payload.isUpvoted;
          commentToUpdate.isDownvoted = action.payload.isDownvoted;
        }
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
  setCommentSortType,
  updateActivePost,
} = postSlice.actions;
export default postSlice.reducer;
