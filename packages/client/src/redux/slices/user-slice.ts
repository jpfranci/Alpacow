import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService, {
  LoginCredentials,
  SignupInfo,
  UpdateUserInfo,
} from "../../services/users";
import { createPost, downvote, Post, upvote } from "./post-slice";

const prefix = "user";

export type UserState = {
  _id?: string; // if id doesn't exist, user is not logged in
  username?: string;
  email?: string;
  reputation?: number;
  posts: Post[];
  votedPosts: { [id: string]: { upvoted: boolean } };
};

// response body for login requests
export type LoginState = {
  _id: string;
  username: string;
  email: string;
  reputation: number;
  upvotedPostIds: string[];
  downvotedPostIds: string[];
};

const initialState: UserState = {
  _id: undefined,
  username: undefined,
  email: undefined,
  posts: [],
  votedPosts: {},
};

export const signup = createAsyncThunk<UserState, SignupInfo>(
  `${prefix}/signup`,
  async (signupInfo: SignupInfo, { rejectWithValue }) => {
    try {
      return await userService.signup(signupInfo);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const updateUser = createAsyncThunk<any, UpdateUserInfo>(
  `${prefix}/update`,
  async (updateUserInfo: UpdateUserInfo, { rejectWithValue }) => {
    try {
      return await userService.update(updateUserInfo._id, updateUserInfo);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk<LoginState, LoginCredentials>(
  `${prefix}/login`,
  async (loginCredentials, { rejectWithValue }) => {
    try {
      return await userService.login(loginCredentials);
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const loginFromCookie = createAsyncThunk<LoginState, void>(
  `${prefix}/loginFromCookie`,
  async (_, { rejectWithValue }) => {
    try {
      return await userService.loginFromCookie();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const logout = createAsyncThunk<void, void>(
  `${prefix}/logout`,
  async (_, { rejectWithValue }) => {
    try {
      return await userService.logout();
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO implement getPosts action
// TODO implement logout action

export const userSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(signup.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const votedPosts = {};
      for (const upvotedPostId of action.payload.upvotedPostIds) {
        votedPosts[upvotedPostId] = { upvoted: true };
      }

      for (const downvotedPostId of action.payload.downvotedPostIds) {
        votedPosts[downvotedPostId] = { upvoted: false };
      }

      return { ...state, ...action.payload, votedPosts };
    });
    builder.addCase(login.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(logout.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(loginFromCookie.fulfilled, (state, action) => {
      console.log("ooo", action.payload);
      const votedPosts = {};
      for (const upvotedPostId of action.payload.upvotedPostIds) {
        votedPosts[upvotedPostId] = { upvoted: true };
      }

      for (const downvotedPostId of action.payload.downvotedPostIds) {
        votedPosts[downvotedPostId] = { upvoted: false };
      }

      return { ...state, ...action.payload, votedPosts };
    });
    builder.addCase(loginFromCookie.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(upvote.fulfilled, (state, action) => {
      state.votedPosts[action.payload.postId] = {
        upvoted: true,
      };
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      state.votedPosts[action.payload.postId] = {
        upvoted: false,
      };
    });
  },
});

export default userSlice.reducer;
