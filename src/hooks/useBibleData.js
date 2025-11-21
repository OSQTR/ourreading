// src/hooks/useBibleData.js

import { useState, useEffect, useCallback } from "react";
import { getBookFromDB, saveBookToDB } from "../utils/indexedDB"; // 4번에서 구현한 DB 유틸리티

const useBibleData = () => {
  const [books, setBooks] = useState([]); // [코드, 이름] 형태의 모든 책 목록 (메타데이터)
  const [currentBookData, setCurrentBookData] = useState(null); // 현재 선택된 책의 전체 장/절 데이터
  const [isLoading, setIsLoading] = useState(true);

  // 1. 메타데이터(책 목록) 로딩 - 최초 1회 실행
  useEffect(() => {
    // Vercel 정적 배포 기준, public/data/meta.json 경로 가정
    fetch("/data/meta.json")
      .then((res) => res.json())
      .then((data) => {
        setBooks(data.books);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("메타데이터 로딩 실패:", err);
        setIsLoading(false);
      });
  }, []);

  // 2. 책 데이터 로딩 (캐싱 및 분할 로딩 로직)
  const loadBook = useCallback(
    async (bookCode) => {
      if (currentBookData?.bookCode === bookCode) return; // 이미 로딩된 데이터면 무시

      setCurrentBookData(null); // 새로운 책 로딩 시작

      // 1) IndexedDB에서 데이터 확인
      let bookData = await getBookFromDB(bookCode);

      if (bookData) {
        console.log(`Book ${bookCode} loaded from IndexedDB cache.`);
        setCurrentBookData(bookData);
        return;
      }

      // 2) IndexedDB에 없으면 네트워크 Fetch 요청 (분할 로딩)
      try {
        console.log(`Book ${bookCode} fetching from network...`);
        const res = await fetch(`/data/book_${bookCode}.json`);
        if (!res.ok) throw new Error("Network response was not ok");

        bookData = await res.json();

        // 3) 데이터를 IndexedDB에 저장하고 상태 업데이트
        await saveBookToDB(bookCode, bookData);
        console.log(`Book ${bookCode} saved to IndexedDB.`);
        setCurrentBookData(bookData);
      } catch (error) {
        console.error(`Book ${bookCode} 로드 실패:`, error);
      }
    },
    [currentBookData]
  ); // currentBookData를 의존성에 넣어 불필요한 재로딩 방지

  return { books, currentBookData, loadBook, isLoading };
};

export default useBibleData;
