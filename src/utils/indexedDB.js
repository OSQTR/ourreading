// src/utils/indexedDB.js

const DB_NAME = "BibleCacheDB";
const DB_VERSION = 1;
const STORE_NAME = "books";

/**
 * IndexedDB를 열거나 생성합니다.
 * @returns {Promise<IDBDatabase>} DB 인스턴스
 */
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // 책 코드(bookCode)를 키로 사용하는 객체 저장소 생성
        db.createObjectStore(STORE_NAME, { keyPath: "bookCode" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(new Error("IndexedDB Open Error: " + event.target.error.message));
    };
  });
};

/**
 * IndexedDB에서 특정 책 데이터를 가져옵니다.
 * @param {number} bookCode 가져올 책의 코드
 * @returns {Promise<Object | null>} 책 데이터 또는 null
 */
export const getBookFromDB = async (bookCode) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    // keyPath가 bookCode이므로, 직접 bookCode로 데이터를 가져옴
    const request = store.get(bookCode);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        // 결과에서 실제 데이터(chapters)만 반환
        resolve(request.result || null);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (e) {
    console.warn("Error reading from IndexedDB (getBookFromDB):", e);
    return null;
  }
};

/**
 * IndexedDB에 책 데이터를 저장합니다.
 * @param {number} bookCode 저장할 책의 코드
 * @param {Object} bookData 저장할 책 데이터
 * @returns {Promise<void>}
 */
export const saveBookToDB = async (bookCode, bookData) => {
  try {
    const db = await openDB();
    // 데이터를 저장하거나 업데이트할 때는 'readwrite' 트랜잭션을 사용
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // keyPath(bookCode)가 이미 존재하면 덮어씁니다.
    const request = store.put({ bookCode, ...bookData });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (e) {
    console.error("Error writing to IndexedDB (saveBookToDB):", e);
  }
};
