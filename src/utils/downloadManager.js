// src/utils/downloadManager.js

import { saveBookToDB, getBookFromDB } from "./db";

/**
 * 모든 성경 책을 순차적으로 다운로드
 * @param {Array} books - [code, name] 형식의 책 목록
 * @param {Function} onProgress - 진행률 콜백 (현재, 전체)
 * @returns {Promise<Object>} { success: boolean, downloaded: number, failed: number }
 */
export const downloadAllBooks = async (books, onProgress) => {
  let downloaded = 0;
  let failed = 0;
  const total = books.length;

  for (let i = 0; i < total; i++) {
    const [bookCode, bookName] = books[i];

    try {
      // 이미 캐시에 있으면 스킵
      const cached = await getBookFromDB(bookCode);
      if (cached) {
        console.log(`⏭ ${bookName} already cached`);
        downloaded++;
        onProgress(downloaded, total);
        continue;
      }

      // 네트워크에서 다운로드
      console.log(`⬇ Downloading ${bookName}...`);
      const res = await fetch(`/data/book_${bookCode}.json`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const bookData = await res.json();

      // IndexedDB에 저장
      await saveBookToDB(bookCode, bookData);

      console.log(`✓ ${bookName} saved`);
      downloaded++;
    } catch (error) {
      console.error(`✗ Failed to download ${bookName}:`, error);
      failed++;
    }

    // 진행률 업데이트
    onProgress(downloaded, total);

    // 네트워크 부하 방지 (200ms 대기)
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return { success: failed === 0, downloaded, failed, total };
};

/**
 * 캐시된 책의 개수 반환
 * @param {Array} books - [code, name] 형식의 책 목록
 * @returns {Promise<number>} 캐시된 책의 개수
 */
export const getCachedCount = async (books) => {
  let count = 0;

  for (const [bookCode] of books) {
    try {
      const cached = await getBookFromDB(bookCode);
      if (cached) {
        count++;
      }
    } catch (error) {
      console.warn(`Error checking cache for ${bookCode}:`, error);
    }
  }

  return count;
};

/**
 * 전체 캐시 삭제
 * @param {Array} books - [code, name] 형식의 책 목록
 * @returns {Promise<void>}
 */
export const clearAllCache = async (books) => {
  for (const [bookCode] of books) {
    try {
      // IndexedDB에서 직접 삭제
      const db = await new Promise((resolve) => {
        const request = indexedDB.open("BibleCacheDB", 2);
        request.onsuccess = (e) => resolve(e.target.result);
      });

      const transaction = db.transaction(["books"], "readwrite");
      const store = transaction.objectStore("books");
      await new Promise((resolve) => {
        const req = store.delete(bookCode);
        req.onsuccess = resolve;
      });
    } catch (error) {
      console.error(`Error deleting cache for ${bookCode}:`, error);
    }
  }

  console.log("✓ All cache cleared");
};

/**
 * 캐시 통계 반환
 * @param {Array} books - [code, name] 형식의 책 목록
 * @returns {Promise<Object>} { cached: number, total: number, percentage: number }
 */
export const getCacheStats = async (books) => {
  const cached = await getCachedCount(books);
  const total = books.length;
  const percentage = Math.round((cached / total) * 100);

  return { cached, total, percentage };
};
