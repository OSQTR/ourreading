// src/hooks/useBibleData.js

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookFromDB, saveBookToDB, getReadingProgress } from "../utils/db";
import {
  initializeBooksFromHook,
  setCurrentBookData,
  setBookListLoading,
  setBookDataLoading,
  setProgressLoading,
  setError,
  restoreProgress,
} from "../store/features/bibleSlice";
import { scrollToPosition } from "../utils/scrollUtils";

const useBibleData = () => {
  const dispatch = useDispatch();
  const { currentBookIdx, books } = useSelector((state) => state.bible);

  const hasInitRef = useRef(false);
  const hasRestoredScrollRef = useRef(false);

  // 1️⃣ 앱 시작: 메타데이터 로드 (한 번만)
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    (async () => {
      dispatch(setBookListLoading(true));
      dispatch(setProgressLoading(true));

      try {
        console.log("🔄 useBibleData: Loading metadata...");
        const metaRes = await fetch("/data/meta.json");
        if (!metaRes.ok) throw new Error("Failed to fetch meta.json");
        const metaData = await metaRes.json();

        dispatch(initializeBooksFromHook(metaData.books));
        console.log(`✓ useBibleData: Loaded ${metaData.books.length} books`);

        // DB에서 마지막 읽기 위치 복구 (book, chapter만)
        const progress = await getReadingProgress();
        if (progress) {
          dispatch(restoreProgress(progress));
          console.log(
            `✓ useBibleData: Restored progress - book=${progress.bookIdx}, chapter=${progress.chapterIdx}, scroll=${progress.scrollY}`
          );
        } else {
          console.log(
            "ℹ useBibleData: No previous progress found, starting from Genesis 1"
          );
        }
      } catch (err) {
        console.error("✗ useBibleData: Init error:", err);
        dispatch(setError({ type: "INIT_ERROR", message: err.message }));
      } finally {
        dispatch(setBookListLoading(false));
        dispatch(setProgressLoading(false));
      }
    })();
  }, [dispatch]);

  // 2️⃣ 책 데이터 로드 (currentBookIdx 변경시 - 매번 실행!)
  useEffect(() => {
    if (!books || books.length === 0) {
      console.log("⏳ useBibleData: Waiting for books...");
      return;
    }

    const book = books[currentBookIdx];
    if (!book) {
      console.log("⏳ useBibleData: currentBookIdx out of range");
      return;
    }

    const [bookCode, bookName] = book;

    console.log(
      `📖 useBibleData: Loading ${bookName} (index: ${currentBookIdx})...`
    );
    dispatch(setBookDataLoading(true));

    (async () => {
      try {
        // 1. DB에서 먼저 확인
        let bookData = await getBookFromDB(bookCode);
        if (bookData) {
          console.log(
            `✓ useBibleData: ${bookName} from cache (${bookData.chapters.length} chapters)`
          );
          dispatch(setCurrentBookData(bookData));
          dispatch(setBookDataLoading(false));
          return;
        }

        // 2. 네트워크에서 로드
        console.log(`⬇ useBibleData: Fetching ${bookName} from network...`);
        const res = await fetch(`/data/book_${bookCode}.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        bookData = await res.json();

        // 3. DB에 저장
        await saveBookToDB(bookCode, bookData);
        dispatch(setCurrentBookData(bookData));

        console.log(
          `✓ useBibleData: ${bookName} fetched (${bookData.chapters.length} chapters)`
        );
      } catch (error) {
        console.error(`✗ useBibleData: Load ${bookCode} failed:`, error);
        dispatch(
          setError({
            type: "BOOK_LOAD_ERROR",
            message: `Failed to load ${bookCode}`,
          })
        );
      } finally {
        dispatch(setBookDataLoading(false));
      }
    })();
  }, [currentBookIdx, books, dispatch]);

  return null;
};

export default useBibleData;
