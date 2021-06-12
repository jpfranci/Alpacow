import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService, {
  LoginCredentials,
  SignupInfo,
} from "../../services/users";
import { createPost, downvote, Post, upvote } from "./post-slice";

const prefix = "user";

export type UserState = {
  id?: string; // if id doesn't exist, user is not logged in
  username?: string;
  email?: string;
  // password?: string (shouldn't be stored on client)
  posts: Post[];
  votedPosts: { [id: string]: { upvoted: boolean } }; // TODO idk if this is best way to do it
};

const initialState: UserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  posts: [],
  votedPosts: {},
};

export const signup = createAsyncThunk<UserState, SignupInfo>(
  `${prefix}/signup`,
  async (signupInfo: SignupInfo, { rejectWithValue }) => {
    try {
      const response = await userService.signup(signupInfo);

      return { ...response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk<UserState, LoginCredentials>(
  `${prefix}/login`,
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await userService.login(credentials);

      // TODO adjust code after we implement this endpoint
      return response.data.length <= 0
        ? rejectWithValue("user doesn't exist")
        : response.data[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// TODO implement getPosts action
// TODO implement update action
// TODO implement logout action

export const userSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      return { ...initialState, ...action.payload };
    });
    builder.addCase(signup.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      return { ...initialState, ...action.payload };
    });
    builder.addCase(login.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
    builder.addCase(upvote.fulfilled, (state, action) => {
      state.votedPosts[action.payload.id] = {
        upvoted: true,
      };
    });
    builder.addCase(downvote.fulfilled, (state, action) => {
      state.votedPosts[action.payload.id] = {
        upvoted: false,
      };
    });
  },
});

export default userSlice.reducer;
