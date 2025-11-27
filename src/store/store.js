// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import bibleReducer from "./features/bibleSlice";
import uiReducer from "./features/uiSlice";
import { loggerMiddleware } from "./middleware/logger";
import { uiPersistMiddleware } from "./middleware/uiPersist";

export const store = configureStore({
  reducer: {
    bible: bibleReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(uiPersistMiddleware),
  devTools: process.env.NODE_ENV !== "production",
});
