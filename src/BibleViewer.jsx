// src/BibleViewer.jsx

import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useBibleData from "./hooks/useBibleData";
import { saveReadingProgress } from "./utils/db";
import Footer from "./Footer";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  font-family: "Noto Serif KR", serif;
`;

const Header = styled.div`
  display: flex;
  padding: 16px 0;
  max-width: 600px;
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 100;
  // background: linear-gradient(180deg, white 80%, transparent);
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
  border: 1px solid #fff;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: white;
    border-color: #ddd;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Content = styled.div`
  line-height: 2;
  font-size: 16px;
  color: #333;
  padding: 80px 16px 20px;
  border-bottom: 1px solid #ddd;
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
  color: #333;
`;

const Selector = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;

  padding: 12px 20px;
  border: 1px solid #fff;
  border-radius: 50px;
  font-size: 15px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.05);
  color: #333;

  &:hover {
    border-color: #ddd;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const BibleViewer = () => {
  const { books, currentBookData, loadBook, isLoading, savedProgress } =
    useBibleData();

  // 저장된 진행 상태로 초기화
  const [currentBookIdx, setCurrentBookIdx] = useState(0);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const saveTimeoutRef = useRef(null);

  const currentBookCode = books[currentBookIdx]?.[0];

  // 1. savedProgress가 로드되면 상태 복구
  useEffect(() => {
    if (savedProgress !== null && !isInitialized) {
      setCurrentBookIdx(savedProgress.bookIdx);
      setCurrentChapterIdx(savedProgress.chapterIdx);
      setIsInitialized(true);
      console.log("✓ Restored reading state");
    } else if (savedProgress === null && !isInitialized && !isLoading) {
      // 첫 접속 (진행 상태 없음)
      setIsInitialized(true);
      console.log("✓ First visit, starting from beginning");
    }
  }, [savedProgress, isLoading, isInitialized]);

  // 2. 책 변경 시 데이터 로드
  useEffect(() => {
    if (currentBookCode !== undefined && isInitialized) {
      loadBook(currentBookCode);
    }
  }, [currentBookCode, loadBook, isInitialized]);

  // 3. 스크롤 저장 (디바운싱)
  useEffect(() => {
    const handleScroll = () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

      saveTimeoutRef.current = setTimeout(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        saveReadingProgress(currentBookIdx, currentChapterIdx, scrollY);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentBookIdx, currentChapterIdx]);

  // 4. 장 변경 시 상단으로 스크롤 + 위치 저장
  useEffect(() => {
    if (isInitialized) {
      saveReadingProgress(currentBookIdx, currentChapterIdx, 0);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [currentChapterIdx, currentBookIdx, isInitialized]);

  // 5. 데이터 로드 후 스크롤 위치 복구
  useEffect(() => {
    if (currentBookData && savedProgress?.scrollY > 0 && isInitialized) {
      setTimeout(() => {
        window.scrollTo({
          top: savedProgress.scrollY,
          left: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  }, [currentBookData, isInitialized, savedProgress]);

  if (isLoading || books.length === 0) {
    return <Container>책 목록을 불러오는 중입니다...</Container>;
  }

  if (!isInitialized) {
    return <Container>읽기 상태를 복구하는 중입니다...</Container>;
  }

  const chapters = currentBookData?.chapters || [];
  const verses = chapters[currentChapterIdx] || [];
  const chaptersLength = chapters.length;

  if (!currentBookData) {
    return (
      <Container>
        {books[currentBookIdx]?.[1]} 데이터를 로드 중입니다...
      </Container>
    );
  }

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx(currentChapterIdx - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chaptersLength - 1) {
      setCurrentChapterIdx(currentChapterIdx + 1);
    }
  };

  const handleChangeBook = (e) => {
    setCurrentBookIdx(Number(e.target.value));
    setCurrentChapterIdx(0);
  };

  return (
    <Container>
      <Header>
        <HeaderFlex>
          <Selector>
            <Select value={currentBookIdx} onChange={handleChangeBook}>
              {books.map((book, idx) => (
                <option key={idx} value={idx}>
                  {book[1]}
                </option>
              ))}
            </Select>

            <Select
              value={currentChapterIdx}
              onChange={(e) => setCurrentChapterIdx(Number(e.target.value))}
              disabled={!currentBookData}
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
            >
              <ChevronLeft size={20} />
            </NavButton>

            <NavButton
              onClick={handleNextChapter}
              disabled={currentChapterIdx === chaptersLength - 1}
            >
              <ChevronRight size={20} />
            </NavButton>
          </Navigation>
        </HeaderFlex>
      </Header>

      <Content>
        {verses.map((text, idx) => (
          <VerseContainer key={idx}>
            <VerseNumber>{idx + 1}</VerseNumber>
            <VerseText>{text}</VerseText>
          </VerseContainer>
        ))}
      </Content>

      <Footer />
    </Container>
  );
};

export default BibleViewer;
