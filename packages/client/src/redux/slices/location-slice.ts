import { createSlice } from "@reduxjs/toolkit";

export type Location = {
  name: string | undefined;
  lat: number;
  lon: number;
};

export const initialState: Location = {
  name: undefined,
  lat: 49.26,
  lon: -123.22,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation(state, action) {
      state = action.payload;
    },
    getLocation(state) {
      return state;
    }
  },
});

export const { setLocation, getLocation } = locationSlice.actions;
export default locationSlice.reducer;