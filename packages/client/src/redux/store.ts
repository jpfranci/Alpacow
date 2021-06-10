import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import postReducer from "./slices/postSlice";
import userReducer from "./slices/userSlice";
import locationReducer from "./slices/locationSlice";

// TODO write instructions for setting up db.json

const store = configureStore({
  reducer: {
    location: locationReducer,
    user: userReducer,
    post: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// using custom dispatch and selector hooks for better typing
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
