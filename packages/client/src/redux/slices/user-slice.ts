import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import userService, {
  LoginCredentials,
  SignupInfo,
} from "../../services/users";
import { createPost, downvote, getPosts, Post, upvote } from "./post-slice";
import firebase from "firebase/app";

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
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      // TODO handle firebase error codes
      const loggedInUser = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const idToken = await loggedInUser.user?.getIdToken();
      const response = await userService.login(idToken as string);
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
    setUser: (state, action: PayloadAction<UserState>) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
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

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
