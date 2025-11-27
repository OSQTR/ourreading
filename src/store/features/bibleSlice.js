// src/store/features/bibleSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 책 목록 및 현재 선택
  books: [], // [[code, name], ...]
  currentBookIdx: 0,
  currentChapterIdx: 0,
  currentBookData: null, // { bookCode, chapters: [...] }

  // 상세한 로딩 상태
  isLoading: {
    booksLoading: false, // 책 목록 로드 중
    bookDataLoading: false, // 책 본문 데이터 로드 중
    progressLoading: false, // 읽기 위치 복구 중
  },

  // 에러 처리
  error: null, // { type: string, message: string, timestamp: number }

  // 스크롤 위치 (bookIdx-chapterIdx: scrollY)
  scrollPositions: {},

  // 캐시 통계 (다운로드 섹션에서 사용)
  cacheStats: {
    cached: 0, // 캐시된 책 개수
    total: 0, // 전체 책 개수
    percentage: 0, // 0-100
    lastUpdated: null, // 마지막 업데이트 시간
  },

  // 다운로드 상태
  isDownloading: false,
  downloadProgress: {
    current: 0, // 현재까지 다운로드된 책 개수
    total: 0, // 전체 책 개수
  },
};

export const bibleSlice = createSlice({
  name: "bible",
  initialState,
  reducers: {
    // ==================== 책 목록 관리 ====================
    initializeBooksFromHook: (state, action) => {
      state.books = action.payload;
      console.log(`✓ Redux: Initialized ${action.payload.length} books`);
    },

    // ==================== 현재 위치 관리 ====================
    setCurrentBookIdx: (state, action) => {
      state.currentBookIdx = action.payload;
      state.currentChapterIdx = 0; // 책 변경 시 첫 장으로
      state.currentBookData = null; // 🔴 이전 책 데이터 초기화
      console.log(`✓ Redux: Changed to book index ${action.payload}`);
    },

    setCurrentChapterIdx: (state, action) => {
      state.currentChapterIdx = action.payload;
      console.log(`✓ Redux: Changed to chapter ${action.payload}`);
    },

    setCurrentBookData: (state, action) => {
      state.currentBookData = action.payload;
      console.log(`✓ Redux: Loaded book data for ${action.payload?.bookCode}`);
    },

    // ==================== 상세한 로딩 상태 ====================
    setBookListLoading: (state, action) => {
      state.isLoading.booksLoading = action.payload;
    },

    setBookDataLoading: (state, action) => {
      state.isLoading.bookDataLoading = action.payload;
    },

    setProgressLoading: (state, action) => {
      state.isLoading.progressLoading = action.payload;
    },

    // ==================== 에러 처리 ====================
    setError: (state, action) => {
      state.error = {
        type: action.payload.type || "unknown",
        message: action.payload.message,
        timestamp: Date.now(),
      };
      console.error(
        `✗ Redux Error [${state.error.type}]: ${state.error.message}`
      );
    },

    clearError: (state) => {
      state.error = null;
    },

    // ==================== 스크롤 위치 관리 ====================
    resetScrollPosition: (state) => {
      const key = `${state.currentBookIdx}-${state.currentChapterIdx}`;
      state.scrollPositions[key] = 0;
    },

    // ==================== 읽기 위치 복구 ====================
    restoreProgress: (state, action) => {
      const { bookIdx, chapterIdx, scrollY } = action.payload;
      state.currentBookIdx = bookIdx;
      state.currentChapterIdx = chapterIdx;
      // ✅ scrollUtils의 generateScrollKey와 동일한 형식 사용 (":")
      const key = `${bookIdx}:${chapterIdx}`;
      state.scrollPositions[key] = scrollY || 0;
      console.log(
        `✓ Redux: Restored progress - book=${bookIdx}, chapter=${chapterIdx}, scroll=${scrollY}, key=${key}`
      );
    },

    // ==================== 캐시 통계 관리 ====================
    updateCacheStats: (state, action) => {
      state.cacheStats = {
        cached: action.payload.cached,
        total: action.payload.total,
        percentage: action.payload.percentage,
        lastUpdated: Date.now(),
      };
      console.log(
        `✓ Redux: Updated cache stats - ${action.payload.cached}/${action.payload.total} (${action.payload.percentage}%)`
      );
    },

    incrementCachedCount: (state) => {
      if (state.cacheStats.total > 0) {
        state.cacheStats.cached += 1;
        state.cacheStats.percentage = Math.round(
          (state.cacheStats.cached / state.cacheStats.total) * 100
        );
      }
    },

    resetCacheStats: (state) => {
      state.cacheStats = {
        cached: 0,
        total: 0,
        percentage: 0,
        lastUpdated: null,
      };
    },

    // ==================== 다운로드 상태 ====================
    setIsDownloading: (state, action) => {
      state.isDownloading = action.payload;
    },

    setDownloadProgress: (state, action) => {
      state.downloadProgress.current = action.payload.current;
      state.downloadProgress.total = action.payload.total;
    },

    incrementDownloadProgress: (state) => {
      state.downloadProgress.current += 1;
    },

    resetDownloadProgress: (state) => {
      state.downloadProgress = { current: 0, total: 0 };
    },
  },
});

export const {
  initializeBooksFromHook,
  setCurrentBookIdx,
  setCurrentChapterIdx,
  setCurrentBookData,
  setBookListLoading,
  setBookDataLoading,
  setProgressLoading,
  setError,
  clearError,
  restoreProgress,
  updateCacheStats,
  incrementCachedCount,
  resetCacheStats,
  setIsDownloading,
  setDownloadProgress,
  incrementDownloadProgress,
  resetDownloadProgress,
} = bibleSlice.actions;

export default bibleSlice.reducer;
