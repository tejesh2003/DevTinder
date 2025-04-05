import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import requestsReducer from "./requestsSlice";

export const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    requests: requestsReducer,
  },
});
