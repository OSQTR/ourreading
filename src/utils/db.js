// src/utils/db.js
// 모든 IndexedDB 작업을 한 곳에서 관리

const DB_NAME = "BibleCacheDB";
const DB_VERSION = 2;
const BOOKS_STORE = "books";
const PROGRESS_STORE = "readingProgress";

let dbInstance = null;

/**
 * DB 인스턴스 초기화 (싱글톤 패턴)
 * 모든 store를 한 번에 생성
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log(
        `IndexedDB upgrade needed: v${event.oldVersion} -> v${DB_VERSION}`
      );

      // books store (성경 본문)
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        db.createObjectStore(BOOKS_STORE, { keyPath: "bookCode" });
        console.log("✓ Created 'books' store");
      }

      // readingProgress store (읽은 위치)
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: "id" });
        console.log("✓ Created 'readingProgress' store");
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      console.log("✓ IndexedDB initialized successfully");
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject(new Error(`IndexedDB Error: ${event.target.error.message}`));
    };

    request.onblocked = () => {
      console.warn("⚠ IndexedDB blocked - close other tabs");
    };
  });
};

/**
 * DB 인스턴스 가져오기
 */
const getDB = async () => {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
};

// ==================== BOOKS (성경 본문) ====================

/**
 * 책 데이터 저장
 */
export const saveBookToDB = async (bookCode, bookData) => {
  try {
    const db = await getDB();
    const transaction = db.transaction([BOOKS_STORE], "readwrite");
    const store = transaction.objectStore(BOOKS_STORE);
    const request = store.put({ bookCode, ...bookData });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(`✓ Saved book ${bookCode}`);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Error saving book to DB:", e);
    throw e;
  }
};

/**
 * 책 데이터 읽기
 */
export const getBookFromDB = async (bookCode) => {
  try {
    const db = await getDB();
    const transaction = db.transaction([BOOKS_STORE], "readonly");
    const store = transaction.objectStore(BOOKS_STORE);
    const request = store.get(bookCode);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("Error reading book from DB:", e);
    return null;
  }
};

// ==================== READING PROGRESS (읽은 위치) ====================

/**
 * 읽은 위치 저장
 */
export const saveReadingProgress = async (bookIdx, chapterIdx, scrollY = 0) => {
  try {
    const db = await getDB();
    const transaction = db.transaction([PROGRESS_STORE], "readwrite");
    const store = transaction.objectStore(PROGRESS_STORE);

    const progressData = {
      id: "current",
      bookIdx,
      chapterIdx,
      scrollY,
      timestamp: Date.now(),
    };

    const request = store.put(progressData);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log(
          `✓ Saved progress: book=${bookIdx}, chapter=${chapterIdx}, scroll=${scrollY}`
        );
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Error saving reading progress:", e);
    throw e;
  }
};

/**
 * 읽은 위치 읽기
 */
export const getReadingProgress = async () => {
  try {
    const db = await getDB();
    const transaction = db.transaction([PROGRESS_STORE], "readonly");
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.get("current");

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          console.log(
            `✓ Loaded progress: book=${result.bookIdx}, chapter=${result.chapterIdx}`
          );
          resolve({
            bookIdx: result.bookIdx,
            chapterIdx: result.chapterIdx,
            scrollY: result.scrollY,
          });
        } else {
          console.log("No reading progress found");
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn("Error reading progress from DB:", e);
    return null;
  }
};

/**
 * 읽은 위치 초기화
 */
export const clearReadingProgress = async () => {
  try {
    const db = await getDB();
    const transaction = db.transaction([PROGRESS_STORE], "readwrite");
    const store = transaction.objectStore(PROGRESS_STORE);
    const request = store.delete("current");

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log("✓ Cleared reading progress");
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error("Error clearing progress:", e);
    throw e;
  }
};

/**
 * DB 초기화 (디버깅용)
 */
export const resetDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      dbInstance = null;
      console.log("✓ Database reset");
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
};
