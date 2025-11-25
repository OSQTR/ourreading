// src/hooks/useBibleData.js

import { useState, useEffect, useCallback } from "react";
import { getBookFromDB, saveBookToDB, getReadingProgress } from "../utils/db";

const useBibleData = () => {
  const [books, setBooks] = useState([]); // 모든 책 목록
  const [currentBookData, setCurrentBookData] = useState(null); // 현재 책 데이터
  const [isLoading, setIsLoading] = useState(true);
  const [savedProgress, setSavedProgress] = useState(null); // 저장된 읽기 위치

  // 1. 앱 시작: 메타데이터 + 저장된 진행 상태 로드
  useEffect(() => {
    const initialize = async () => {
      try {
        // 메타데이터 로드
        const metaRes = await fetch("/data/meta.json");
        const metaData = await metaRes.json();
        setBooks(metaData.books);

        // DB에서 저장된 읽기 위치 로드
        const progress = await getReadingProgress();
        setSavedProgress(progress);

        console.log("✓ App initialized");
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // 2. 책 데이터 로드 (캐싱)
  const loadBook = useCallback(
    async (bookCode) => {
      if (currentBookData?.bookCode === bookCode) return;

      setCurrentBookData(null);

      try {
        // DB에서 먼저 확인
        let bookData = await getBookFromDB(bookCode);

        if (bookData) {
          console.log(`✓ Book ${bookCode} loaded from cache`);
          setCurrentBookData(bookData);
          return;
        }

        // DB에 없으면 네트워크에서 로드
        console.log(`Fetching book ${bookCode} from network...`);
        const res = await fetch(`/data/book_${bookCode}.json`);
        if (!res.ok) throw new Error("Network response failed");

        bookData = await res.json();

        // DB에 저장
        await saveBookToDB(bookCode, bookData);
        setCurrentBookData(bookData);
      } catch (error) {
        console.error(`Book ${bookCode} load failed:`, error);
      }
    },
    [currentBookData]
  );

  return {
    books,
    currentBookData,
    loadBook,
    isLoading,
    savedProgress, // 저장된 읽기 위치 반환
  };
};

export default useBibleData;
