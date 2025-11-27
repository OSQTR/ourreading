// src/store/middleware/uiPersist.js

/**
 * UI 상태를 localStorage에 저장/복구하는 미들웨어
 * 폰트, 폰트 크기, 다크모드 설정을 유지
 */

const UI_PERSIST_KEY = "bibleApp_uiState";

/**
 * localStorage에서 UI 상태 복구
 */
export const loadUIState = () => {
  try {
    const saved = localStorage.getItem(UI_PERSIST_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      console.log("✓ Loaded UI state from localStorage:", state);
      return state;
    }
  } catch (error) {
    console.warn("⚠ Failed to load UI state from localStorage:", error);
  }
  return null;
};

/**
 * localStorage에 UI 상태 저장
 */
export const saveUIState = (state) => {
  try {
    localStorage.setItem(UI_PERSIST_KEY, JSON.stringify(state));
    console.log("✓ Saved UI state to localStorage:", state);
  } catch (error) {
    console.error("✗ Failed to save UI state to localStorage:", error);
  }
};

/**
 * Redux 미들웨어 - 액션 후 UI 상태 저장
 */
export const uiPersistMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // UI 관련 액션 후 저장
  if (action.type.startsWith("ui/")) {
    const uiState = store.getState().ui;
    saveUIState(uiState);
  }

  return result;
};
