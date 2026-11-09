
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async () => {
    const response = await api.get("/auth/user");
    return response.data.data;
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    isLoading: false,
    user: null,
    isError: false,
    isInitialized: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isError = false;
        state.isInitialized = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.isInitialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default authSlice.reducer;
