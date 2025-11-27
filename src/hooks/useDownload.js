// src/hooks/useDownload.js

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadAllBooks,
  getCacheStats,
  clearAllCache,
} from "../utils/downloadManager";
import {
  setIsDownloading,
  setDownloadProgress,
  updateCacheStats,
  resetCacheStats,
  resetDownloadProgress,
} from "../store/features/bibleSlice";

/**
 * 성경 본문 다운로드 상태를 관리하는 커스텀 훅
 * Redux의 cacheStats, downloadProgress를 직접 사용
 */
const useDownload = (books) => {
  const dispatch = useDispatch();

  // Redux 상태 구독
  const { isDownloading, cacheStats, downloadProgress } = useSelector(
    (state) => state.bible
  );

  // 계산된 퍼센티지
  const downloadPercentage = cacheStats.percentage;

  // 1️⃣ 초기 로드: 캐시 통계 업데이트
  useEffect(() => {
    if (books.length === 0) return;

    const initializeCacheStats = async () => {
      try {
        const stats = await getCacheStats(books);
        dispatch(
          updateCacheStats({
            cached: stats.cached,
            total: stats.total,
            percentage: stats.percentage,
          })
        );
        console.log(
          `✓ useDownload: Initialized cache stats - ${stats.cached}/${stats.total} (${stats.percentage}%)`
        );
      } catch (error) {
        console.error("useDownload: Failed to get cache stats:", error);
      }
    };

    initializeCacheStats();
  }, [books, dispatch]);

  // 2️⃣ 전체 다운로드 시작
  const startDownload = useCallback(async () => {
    if (isDownloading || books.length === 0) {
      console.warn("useDownload: Download already in progress or no books");
      return;
    }

    dispatch(setIsDownloading(true));
    dispatch(setDownloadProgress({ current: 0, total: books.length }));

    try {
      await downloadAllBooks(books, (current, total) => {
        dispatch(setDownloadProgress({ current, total }));
        console.log(`⬇ useDownload: Download progress ${current}/${total}`);
      });

      console.log(`✓ useDownload: Download complete`);

      // 다운로드 완료 후 캐시 통계 업데이트
      const stats = await getCacheStats(books);
      dispatch(
        updateCacheStats({
          cached: stats.cached,
          total: stats.total,
          percentage: stats.percentage,
        })
      );
    } catch (error) {
      console.error("useDownload: Download failed:", error);
    } finally {
      dispatch(setIsDownloading(false));
      dispatch(resetDownloadProgress());
    }
  }, [books, isDownloading, dispatch]);

  // 3️⃣ 캐시 전체 삭제
  const clearCache = useCallback(async () => {
    if (books.length === 0) {
      console.warn("useDownload: No books to clear");
      return;
    }

    try {
      await clearAllCache(books);
      console.log("✓ useDownload: Cache cleared");

      // 캐시 삭제 후 통계 초기화
      dispatch(resetCacheStats());
      dispatch(resetDownloadProgress());
    } catch (error) {
      console.error("useDownload: Failed to clear cache:", error);
    }
  }, [books, dispatch]);

  return {
    isDownloading,
    downloadPercentage,
    currentProgress: downloadProgress.current,
    totalBooks: downloadProgress.total,
    cachedCount: cacheStats.cached,
    totalCachedBooks: cacheStats.total,
    startDownload,
    clearCache,
  };
};

export default useDownload;
