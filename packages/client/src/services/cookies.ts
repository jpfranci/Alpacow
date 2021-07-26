import { UserState } from "../redux/slices/user-slice";
import Cookies from "js-cookie";

const IDENTITY_COOKIE_KEY = "alpacow_user";

export const getUser = (): UserState | undefined => {
  const cookieValue = Cookies.get(IDENTITY_COOKIE_KEY);
  if (cookieValue) {
    return JSON.parse(cookieValue);
  } else {
    return undefined;
  }
};
