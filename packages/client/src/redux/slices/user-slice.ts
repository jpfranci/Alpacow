import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService, {
  LoginCredentials,
  SignupInfo,
} from "../../services/users";
import { createPost, downvote, getPosts, Post, upvote } from "./post-slice";

const prefix = "user";

export type UserState = {
  _id?: string; // if id doesn't exist, user is not logged in
  username?: string;
  email?: string;
  reputation?: number;
  // password?: string (shouldn't be stored on client)
  posts: Post[];
  votedPosts: { [id: string]: { upvoted: boolean } }; // TODO idk if this is best way to do it
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

export const getPostsByUser = createAsyncThunk<Post[], UserState>(
  `${prefix}/getPostsByUser`,
  async (userState: UserState, { rejectWithValue }) => {
    try {
      // TODO: probably allow view profile to toggle between hot and new in the future
      const response = await userService.getPostsByUser(
        String(userState._id),
        "new",
      );
      return response.data;
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
  reducers: {
    logout: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signup.fulfilled, (state, action) => {
      return { ...initialState, ...action.payload };
    });
    builder.addCase(signup.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state = action.payload;
      return { ...initialState, ...action.payload };
    });
    builder.addCase(login.rejected, (state, action) => {
      return { ...initialState };
    });
    builder.addCase(getPostsByUser.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(getPostsByUser.rejected, (state, action) => {
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

export const { logout } = userSlice.actions;

export default userSlice.reducer;
