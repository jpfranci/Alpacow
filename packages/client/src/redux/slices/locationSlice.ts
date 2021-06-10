import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import locationService from "../../services/location";

export type Location = {
  name: string;
  lat: number;
  lon: number;
};

export const initialState: Location = {
  name: "Vancouver",
  lat: 49.26,
  lon: -123.22,
};

export const getLocation = createAsyncThunk(
  `location/getLocation`,
  async (_, { rejectWithValue }) => {
    try {
      const response= await locationService.getLoc();

      return { location: response.data };
    } catch (error) {
      let newLocation = initialState;
      navigator.geolocation.getCurrentPosition(function (position) {
        newLocation.lat = position.coords.latitude;
        newLocation.lon = position.coords.longitude;
      });
      return { location: newLocation };
    }
  },
);

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLocation.fulfilled, (state, action) => {
      state = action.payload.location;
    });
    builder.addCase(getLocation.rejected, (state, action) => {
      return { ...initialState };
    });
  },
});

export const { setLocation } =
  locationSlice.actions;
export default locationSlice.reducer;