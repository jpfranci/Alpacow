import axios from "axios";
import { LoginState, UserState } from "../redux/slices/user-slice";
import { Post, PostSortType } from "../redux/slices/post-slice";
import firebase from "firebase/app";
import "firebase/auth";
import SignupErrorCode from "../errors/signup-errors";
import ActionableError from "../errors/actionable-error";
import LoginErrorCode from "../errors/login-errors";
import UpdateErrorCode from "../errors/update-errors";

const baseUrl = "/api/users";

export type LoginCredentials = {
  email: string;
  password: string;
};

type ValidationInfo = {
  email: string;
  username: string;
};

export type SignupInfo = {
  username: string;
  password: string;
  email: string;
};

export type UpdateUserInfo = {
  username?: string;
  email?: string;
};

const signupWithFirebase = async (
  signupInfo: SignupInfo,
): Promise<firebase.auth.UserCredential> => {
  try {
    const { email, password } = signupInfo;
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  } catch (err) {
    switch (err.code) {
      case "auth/email-already-in-use":
        throw new ActionableError(
          SignupErrorCode.DUPLICATE_EMAIL,
          "Email already in use.",
        );
      case "auth/weak-password":
        throw new ActionableError(SignupErrorCode.WEAK_PASSWORD, err.message);
      case "auth/invalid-email":
        throw new ActionableError(SignupErrorCode.INVALID_EMAIL, err.message);
      default:
        throw new Error(err.message);
    }
  }
};

const loginWithFirebase = async (
  credentials: LoginCredentials,
): Promise<firebase.auth.UserCredential> => {
  try {
    const { email, password } = credentials;
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    switch (err.code) {
      case "auth/invalid-email":
      case "auth/user-not-found":
      case "auth/user-disabled":
        throw new ActionableError(
          LoginErrorCode.USER_NOT_FOUND,
          "No user was found with that email.",
        );
      case "auth/wrong-password":
        throw new ActionableError(
          LoginErrorCode.WRONG_PASSWORD,
          "Password was invalid",
        );
      default:
        throw new Error(err.message);
    }
  }
};

const signup = async (signupInfo: SignupInfo): Promise<UserState> => {
  const { email, username } = signupInfo;
  const userCredential = await signupWithFirebase(signupInfo);
  const idToken = await userCredential.user?.getIdToken();
  try {
    const response = await axios.post(`${baseUrl}`, {
      email,
      username,
      idToken,
    });
    return response.data;
  } catch (err) {
    const { errorCode } = err.response.data;
    if (errorCode) {
      switch (errorCode) {
        case SignupErrorCode.DUPLICATE_EMAIL:
          throw new ActionableError(
            SignupErrorCode.DUPLICATE_EMAIL,
            "Email already in use.",
          );
        case SignupErrorCode.DUPLICATE_USERNAME:
          throw new ActionableError(
            SignupErrorCode.DUPLICATE_USERNAME,
            "Username already in use.",
          );
      }
    }
    throw err;
  }
};

const login = async (
  loginCredentials: LoginCredentials,
): Promise<LoginState> => {
  const userCredential = await loginWithFirebase(loginCredentials);
  const idToken = await userCredential.user?.getIdToken();
  const response = await axios.post(`${baseUrl}/login`, { idToken });
  return response.data;
};

const getUserProfile = async (userId: string): Promise<UserState> => {
  const response = await axios.get(`${baseUrl}/${userId}/profile`);
  return response.data;
};

const loginFromCookie = async (): Promise<LoginState> => {
  const response = await axios.post(`${baseUrl}/loginFromCookie`);
  return response.data;
};

const logout = async () => {
  await Promise.all([
    firebase.auth().signOut(),
    axios.post(`${baseUrl}/logout`),
  ]);
};

const validate = async (
  credentials: ValidationInfo,
): Promise<{ usernameExists: boolean; emailExists: boolean }> => {
  const response = await axios.post(`${baseUrl}/validate`, credentials);
  return response.data;
};

const update = async (updateUserInfo: UpdateUserInfo) => {
  let currentUser = firebase.auth().currentUser;
  if (updateUserInfo.email) {
    if (!currentUser) {
      throw new ActionableError(
        UpdateErrorCode.SESSION_TOO_OLD,
        "Please login again to update email",
      );
    }
    try {
      await currentUser.updateEmail(updateUserInfo.email);
      const idToken = await currentUser.getIdToken();
      await axios.post(`${baseUrl}/login`, { idToken });
    } catch (err) {
      switch (err.code) {
        case "auth/email-already-in-use":
          throw new ActionableError(
            UpdateErrorCode.EMAIL_IN_USE,
            "Email already in use",
          );
        case "auth/requires-recent-login":
          throw new ActionableError(
            UpdateErrorCode.SESSION_TOO_OLD,
            "Please login again to update email",
          );
        default:
          throw err;
      }
    }
  }

  const response = await axios.post(`${baseUrl}/update`, updateUserInfo);
  return response.data;
};

const getPostsByUser = async ({
  id,
  sortType,
  showMatureContent,
}: {
  id: string;
  sortType: PostSortType;
  showMatureContent: boolean;
}): Promise<Post[]> => {
  const response = await axios.get(`${baseUrl}/${id}/posts`, {
    params: {
      sortType,
      showMatureContent,
    },
  });
  return response.data;
};

const getPostsByUserVote = async ({
  id,
  sortType,
  isUpvoted,
  showMatureContent,
}: {
  id: string;
  sortType: PostSortType;
  isUpvoted: boolean;
  showMatureContent: boolean;
}): Promise<Post[]> => {
  const response = await axios.get(`${baseUrl}/${id}/voted`, {
    params: {
      isUpvoted,
      sortType,
      showMatureContent,
    },
  });
  return response.data;
};

const userService = {
  signup,
  login,
  update,
  getUserProfile,
  getPostsByUser,
  getPostsByUserVote,
  validate,
  loginFromCookie,
  logout,
};

export default userService;
