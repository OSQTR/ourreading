// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import bibleReducer from "./features/bibleSlice";
import uiReducer from "./features/uiSlice";
import { loggerMiddleware } from "./middleware/logger";

export const store = configureStore({
  reducer: {
    bible: bibleReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});
