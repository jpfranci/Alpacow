import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService, {
  LoginCredentials,
  SignupInfo,
} from "../../services/users";
import { createPost, downvote, Post, upvote } from "./post-slice";

const prefix = "user";

export type UserState = {
  _id?: string; // if id doesn't exist, user is not logged in
  username?: string;
  email?: string;
  reputation?: number;
  posts: Post[];
};

// response body for login requests
export type LoginState = {
  _id: string;
  username: string;
  email: string;
  reputation: number;
};

const initialState: UserState = {
  _id: undefined,
  username: undefined,
  email: undefined,
  posts: [],
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
// TODO implement update action
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
    builder.addCase(login.fulfilled, (state, action) => {
      return { ...state, ...action.payload };
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
      return { ...state, ...action.payload };
    });
    builder.addCase(loginFromCookie.rejected, (state, action) => {
      return { ...state };
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts.push(action.payload);
    });
  },
});

export default userSlice.reducer;
