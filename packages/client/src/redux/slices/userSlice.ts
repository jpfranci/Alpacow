import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService, { LoginCredentials, SignupInfo } from "../../services/auth";
import postService from "../../services/posts";
import { NewPost, Post } from "./postSlice";

const prefix = "user";

type UserState = {
  id?: string;
  username?: string;
  email?: string;
  // password?: string (shouldn't be stored on client)
  posts: Post[];
};

const initialState: UserState = {
  id: undefined,
  username: undefined,
  email: undefined,
  posts: [],
};

export const signup = createAsyncThunk(
  `${prefix}/signup`,
  async (signupInfo: SignupInfo, { rejectWithValue }) => {
    try {
      const response = await authService.signup(signupInfo);

      return { user: response.data };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const login = createAsyncThunk(
  `${prefix}/login`,
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);

      // TODO adjust code after we implement endpoint
      return response.data.length <= 0
        ? rejectWithValue("user doesn't exist")
        : { user: response.data[0] };
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

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

// TODO implement getPosts action
// TODO implement update action
// TODO implement delete action
// TODO implement logout action

export const userSlice = createSlice({
  name: prefix,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      return { ...initialState, ...action.payload.user };
    });
    builder.addCase(signup.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      return { ...initialState, ...action.payload.user };
    });
    builder.addCase(login.rejected, (state, action) => {
      return { ...initialState };
    });
  },
});

// TODO fill if we ever get any synchronous actions
// export const {} = userSlice.actions;

export default userSlice.reducer;
