// src/store/middleware/logger.js

/**
 * Redux 액션 로깅 미들웨어
 * 콘솔에 액션 타입, 페이로드, 상태 변화를 출력합니다.
 */
export const loggerMiddleware = (store) => (next) => (action) => {
  const prevState = store.getState();
  const timestamp = new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });

  console.group(
    `%c[${timestamp}] ${action.type}`,
    "color: #0066cc; font-weight: bold;"
  );

  // 액션 페이로드 출력
  if (action.payload !== undefined) {
    console.log(
      "%cPayload:",
      "color: #666; font-weight: bold;",
      action.payload
    );
  }

  // 액션 실행
  const result = next(action);

  // 상태 변화 출력
  const nextState = store.getState();
  console.log("%cPrev State:", "color: #f56565;", prevState);
  console.log("%cNext State:", "color: #48bb78;", nextState);

  console.groupEnd();

  return result;
};
