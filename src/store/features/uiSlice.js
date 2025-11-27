// src/store/features/uiSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentTab: "read",
  fontSize: 16,
  fontFamily: "Noto Serif KR",
  isDarkMode: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // 탭 변경 (5번)
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },

    // 글자 크기 설정 (7번)
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },

    // 폰트 변경 (7번)
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },

    // 다크모드 토글 (7번)
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
});

export const { setCurrentTab, setFontSize, setFontFamily, setDarkMode } =
  uiSlice.actions;

export default uiSlice.reducer;
