import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    //SignIn
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //SignOut
    signOutStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    signOutFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    //Update User
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    //Delete User
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutStart,
  signOutSuccess,
  signOutFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} = userSlice.actions;
export default userSlice.reducer;
