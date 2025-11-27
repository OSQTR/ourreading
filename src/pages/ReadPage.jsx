// src/pages/ReadPage.jsx
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { saveReadingProgress } from "../utils/db";
import {
  setCurrentBookIdx,
  setCurrentChapterIdx,
  saveScrollPosition,
} from "../store/features/bibleSlice";
import { scrollToPosition } from "../utils/scrollUtils";
import useBibleData from "../hooks/useBibleData";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  font-family: ${(props) => props.fontFamily}, serif;
  background-color: ${(props) => (props.isDarkMode ? "#1a1a1a" : "#fff")};
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  transition: background-color 0.3s, color 0.3s;
`;

const Header = styled.div`
  display: flex;
  padding: 16px 0;
  max-width: 600px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
  /* background: linear-gradient(
    180deg,
    ${(props) => (props.isDarkMode ? "#1a1a1a" : "white")} 80%,
    transparent
  ); */
`;

const HeaderFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 16px;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#ddd")};
  background-color: ${(props) =>
    props.isDarkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.1)"};
  backdrop-filter: blur(10px);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};

  &:hover {
    background-color: ${(props) =>
      props.isDarkMode ? "rgba(255, 255, 255, 0.1)" : "white"};
    border-color: ${(props) => (props.isDarkMode ? "#666" : "#999")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Content = styled.div`
  line-height: 2;
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  padding: 80px 16px 80px;
  border-bottom: 1px solid ${(props) => (props.isDarkMode ? "#333" : "#ddd")};
`;

const VerseContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 4px;
`;

const VerseNumber = styled.span`
  font-weight: bold;
  font-size: small;
  color: #0066cc;
  min-width: 30px;
  margin-top: 3px;
  text-align: center;
  flex-shrink: 0;
`;

const VerseText = styled.span`
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
`;

const Selector = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 12px 20px;
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#ddd")};
  border-radius: 50px;
  font-size: 15px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isDarkMode
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(255, 255, 255, 0.1)"};
  backdrop-filter: blur(10px);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.05);
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  font-family: ${(props) => props.fontFamily};

  &:hover {
    border-color: ${(props) => (props.isDarkMode ? "#666" : "#999")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  option {
    background-color: ${(props) => (props.isDarkMode ? "#2a2a2a" : "white")};
    color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 16px;
  color: #999;
`;

const ReadPage = () => {
  const dispatch = useDispatch();
  const {
    books,
    currentBookIdx,
    currentChapterIdx,
    currentBookData,
    isLoading,
    scrollPositions,
  } = useSelector((state) => state.bible);

  const { fontSize, fontFamily, isDarkMode } = useSelector((state) => state.ui);

  // useBibleData: 초기화 및 자동 데이터 로드
  useBibleData();

  const saveTimeoutRef = useRef(null);
  const hasInitializedRef = useRef(false);
  const hasRestoredScrollRef = useRef(false);

  // 초기화 완료 (progressLoading이 false가 될 때까지 대기)
  useEffect(() => {
    if (
      books.length > 0 &&
      !isLoading.progressLoading &&
      !hasInitializedRef.current
    ) {
      hasInitializedRef.current = true;
      console.log("✓ ReadPage: Initialization complete");
    }
  }, [books.length, isLoading.progressLoading]);

  // 스크롤 저장 (사용자가 스크롤할 때)
  useEffect(() => {
    const handleScroll = () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        const scrollY = window.scrollY;
        // Redux에도 저장
        dispatch(
          saveScrollPosition({
            bookIdx: currentBookIdx,
            chapterIdx: currentChapterIdx,
            scrollY,
          })
        );
        // DB에도 저장 (최후의 방문 위치)
        saveReadingProgress(currentBookIdx, currentChapterIdx, scrollY);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentBookIdx, currentChapterIdx, dispatch]);

  // 장 변경 시: 상단으로 스크롤 + DB에 0 저장
  useEffect(() => {
    if (!hasInitializedRef.current) return;

    hasRestoredScrollRef.current = false;
    scrollToPosition(0, "smooth");
    saveReadingProgress(currentBookIdx, currentChapterIdx, 0);
  }, [currentChapterIdx, currentBookIdx]);

  // 데이터 로드 완료 후 스크롤 복구 (한 번만)
  useEffect(() => {
    if (
      !hasInitializedRef.current ||
      !currentBookData ||
      hasRestoredScrollRef.current
    ) {
      return;
    }

    hasRestoredScrollRef.current = true;

    // 다음 프레임에서 스크롤 복구 (DOM 렌더링 후)
    requestAnimationFrame(() => {
      const key = `${currentBookIdx}:${currentChapterIdx}`;
      const savedScrollY = scrollPositions[key] || 0;

      if (savedScrollY > 0) {
        scrollToPosition(savedScrollY, "auto");
        console.log(
          `✓ ReadPage: Restored scroll position ${savedScrollY} for key ${key}`
        );
      } else {
        console.log(`ℹ ReadPage: No saved scroll position for key ${key}`);
      }
    });
  }, [currentBookData, currentBookIdx, currentChapterIdx, scrollPositions]);

  // 로딩 상태 처리
  if (isLoading.booksLoading) {
    return <LoadingMessage>책 목록을 불러오는 중입니다...</LoadingMessage>;
  }

  if (books.length === 0) {
    return <LoadingMessage>⚠️ 책 목록을 찾을 수 없습니다.</LoadingMessage>;
  }

  if (isLoading.progressLoading) {
    return <LoadingMessage>📖 읽기 상태를 복구하는 중입니다...</LoadingMessage>;
  }

  if (!hasInitializedRef.current) {
    return <LoadingMessage>⏳ 초기화 중입니다...</LoadingMessage>;
  }

  if (isLoading.bookDataLoading) {
    return (
      <LoadingMessage>
        📚 {books[currentBookIdx]?.[1]} 데이터를 로드 중입니다...
      </LoadingMessage>
    );
  }

  if (!currentBookData) {
    return (
      <LoadingMessage>
        ⚠️ {books[currentBookIdx]?.[1]} 데이터를 불러올 수 없습니다.
      </LoadingMessage>
    );
  }

  const chapters = currentBookData?.chapters || [];
  const verses = chapters[currentChapterIdx] || [];
  const chaptersLength = chapters.length;

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      dispatch(setCurrentChapterIdx(currentChapterIdx - 1));
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chaptersLength - 1) {
      dispatch(setCurrentChapterIdx(currentChapterIdx + 1));
    }
  };

  const handleChangeBook = (e) => {
    dispatch(setCurrentBookIdx(Number(e.target.value)));
  };

  const handleChangeChapter = (e) => {
    dispatch(setCurrentChapterIdx(Number(e.target.value)));
  };

  return (
    <Container fontFamily={fontFamily} isDarkMode={isDarkMode}>
      <Header isDarkMode={isDarkMode}>
        <HeaderFlex>
          <Selector>
            <Select
              value={currentBookIdx}
              onChange={handleChangeBook}
              isDarkMode={isDarkMode}
              fontFamily={fontFamily}
            >
              {books.map((book, idx) => (
                <option key={idx} value={idx}>
                  {book[1]}
                </option>
              ))}
            </Select>

            <Select
              value={currentChapterIdx}
              onChange={handleChangeChapter}
              disabled={!currentBookData}
              isDarkMode={isDarkMode}
              fontFamily={fontFamily}
            >
              {chapters.map((_, idx) => (
                <option key={idx} value={idx}>
                  {idx + 1}장
                </option>
              ))}
            </Select>
          </Selector>

          <Navigation>
            <NavButton
              onClick={handlePrevChapter}
              disabled={currentChapterIdx === 0}
              isDarkMode={isDarkMode}
            >
              <ChevronLeft size={20} />
            </NavButton>

            <NavButton
              onClick={handleNextChapter}
              disabled={currentChapterIdx === chaptersLength - 1}
              isDarkMode={isDarkMode}
            >
              <ChevronRight size={20} />
            </NavButton>
          </Navigation>
        </HeaderFlex>
      </Header>

      <Content fontSize={fontSize} isDarkMode={isDarkMode}>
        {verses.map((text, idx) => (
          <VerseContainer key={idx}>
            <VerseNumber>{idx + 1}</VerseNumber>
            <VerseText isDarkMode={isDarkMode}>{text}</VerseText>
          </VerseContainer>
        ))}
      </Content>
    </Container>
  );
};

export default ReadPage;
