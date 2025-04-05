import { createSlice } from "@reduxjs/toolkit";

const requestsSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    addRequests(state, action) {
      return action.payload;
    },
    removeRequests(state, action) {
      return state.filter((request) => request.id !== action.payload);
    },
  },
});

export const { addRequests, removeRequests } = requestsSlice.actions;
export default requestsSlice.reducer;
