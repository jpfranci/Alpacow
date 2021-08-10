import axios from "axios";
import { LoginState, UserState } from "../redux/slices/user-slice";
import { Post } from "../redux/slices/post-slice";
import firebase from "firebase";
import SignupErrorCode from "../errors/signup-errors";
import ActionableError from "../errors/actionable-error";
import LoginErrorCode from "../errors/login-errors";

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
  _id: string;
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

const update = async (id: string, updateUserInfo: UpdateUserInfo) => {
  const currentUser = firebase.auth().currentUser;
  if (currentUser && updateUserInfo.email) {
    await currentUser.updateEmail(updateUserInfo.email);
  }
  const response = await axios.patch(`${baseUrl}/${id}`, updateUserInfo);
  return response.data;
};

const getPostsByUser = async (
  id: string,
  sortType: string,
): Promise<Post[]> => {
  const response = await axios.get(`${baseUrl}/${id}/posts`, {
    params: {
      sortType: sortType,
    },
  });
  return response.data;
};

const userService = {
  signup,
  login,
  update,
  getPostsByUser,
  validate,
  loginFromCookie,
  logout,
};

export default userService;
