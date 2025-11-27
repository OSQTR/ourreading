// src/utils/scrollUtils.js

/**
 * 특정 위치로 스크롤 이동
 *
 * @param {number} scrollY - 이동할 위치
 * @param {string} behavior - 'auto' 또는 'smooth'
 * @returns {void}
 */
export const scrollToPosition = (scrollY, behavior = "auto") => {
  window.scrollTo({
    top: scrollY,
    left: 0,
    behavior,
  });
};
