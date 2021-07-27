import axios from "axios";
import { UserState } from "../redux/slices/user-slice";
import { Post } from "../redux/slices/post-slice";
import firebase from "firebase";
import SignupErrorCode from "../errors/signup-errors";
import LoginErrorCode from "../errors/login-errors";
import UserCredential = firebase.auth.UserCredential;
import ActionableError from "../errors/ActionableError";

const baseUrl = "/api/users";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupInfo = {
  username: string;
  password: string;
  email: string;
};

const DUPLICATE_EMAIL_ERROR = new ActionableError(
  SignupErrorCode.DUPLICATE_EMAIL,
  "Email already in use.",
);
const DUPLICATE_USERNAME_ERROR = new ActionableError(
  SignupErrorCode.DUPLICATE_USERNAME,
  "Username already in use.",
);

// TODO add return types once backend types are done

const signupWithFirebase = async (
  signupInfo: SignupInfo,
): Promise<UserCredential> => {
  try {
    const { email, password } = signupInfo;
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  } catch (err) {
    switch (err.code) {
      case "auth/email-already-in-use":
        throw DUPLICATE_EMAIL_ERROR;
      case "auth/weak-password":
        throw new ActionableError(
          SignupErrorCode.WEAK_PASSWORD,
          "Your password is too weak, please enter a stronger one",
        );
      default:
        throw new Error(err.message);
    }
  }
};

const loginWithFirebase = async (credentials: LoginCredentials) => {
  try {
    const { email, password } = credentials;
  } catch (err) {}
};

const signup = async (signupInfo: SignupInfo) => {
  const { email, password } = signupInfo;
  const userCredential = await signupWithFirebase(signupInfo);
  const idToken = await userCredential.user?.getIdToken();
  try {
    const response = await axios.post(`${baseUrl}`, {
      email,
      password,
      idToken,
    });
    return response.data;
  } catch (err) {
    const { errorCode } = err.response.data.errorCode;
    if (errorCode) {
      switch (errorCode) {
        case SignupErrorCode.DUPLICATE_EMAIL:
          throw DUPLICATE_EMAIL_ERROR;
        case SignupErrorCode.DUPLICATE_USERNAME:
          throw DUPLICATE_USERNAME_ERROR;
      }
    }
    throw err;
  }
};

const login = async (idToken: string) => {
  const response = await axios.post(`${baseUrl}/login`, { idToken });
  return response.data;
};

const update = async (id: string, partialUser: Partial<UserState>) => {
  const response = await axios.put(`/users/${id}`, partialUser);
  return response;
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
};

export default userService;
