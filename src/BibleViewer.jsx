import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Noto Serif KR", serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e0e0e0;
`;

const Title = styled.h1`
  font-size: 28px;
  margin: 0;
  color: #333;
`;

const ChapterInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  color: #666;
`;

const Navigation = styled.div`
  display: flex;
  gap: 10px;
  margin-left: 20px;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0f0f0;
    border-color: #999;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Content = styled.div`
  line-height: 2;
  font-size: 16px;
  color: #333;
`;

const VerseContainer = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 10px;
`;

const VerseNumber = styled.span`
  font-weight: bold;
  color: #0066cc;
  min-width: 30px;
  flex-shrink: 0;
`;

const VerseText = styled.span`
  color: #333;
`;

const Selector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  background: white;

  &:hover {
    border-color: #999;
  }
`;

const BibleViewer = ({ bibleData }) => {
  const [currentBookIdx, setCurrentBookIdx] = useState(0);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (!bibleData) return;

    // 현재 책에 속한 모든 장 찾기
    const bookChapters = bibleData.chapters.filter(
      (ch) => ch[0] === currentBookIdx
    );
    setChapters(bookChapters);
    setCurrentChapterIdx(0);
  }, [currentBookIdx, bibleData]);

  if (!bibleData || bibleData.books.length === 0) {
    return <Container>데이터를 불러올 수 없습니다.</Container>;
  }

  const books = bibleData.books;
  const currentBook = books[currentBookIdx];
  const [bookCode, bookName] = currentBook;
  const currentChapter = chapters[currentChapterIdx];
  const [, verses] = currentChapter || [, []];

  const handlePrevBook = () => {
    if (currentBookIdx > 0) {
      setCurrentBookIdx(currentBookIdx - 1);
    }
  };

  const handleNextBook = () => {
    if (currentBookIdx < books.length - 1) {
      setCurrentBookIdx(currentBookIdx + 1);
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx(currentChapterIdx - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chapters.length - 1) {
      setCurrentChapterIdx(currentChapterIdx + 1);
    }
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>{bookName}</Title>
          <ChapterInfo>
            {currentChapterIdx + 1}장 ({verses.length}절)
          </ChapterInfo>
        </div>
        <Navigation>
          <NavButton onClick={handlePrevBook} disabled={currentBookIdx === 0}>
            <ChevronLeft size={20} />
          </NavButton>
          <NavButton
            onClick={handleNextBook}
            disabled={currentBookIdx === books.length - 1}
          >
            <ChevronRight size={20} />
          </NavButton>
        </Navigation>
      </Header>

      <Selector>
        <Select
          value={currentBookIdx}
          onChange={(e) => setCurrentBookIdx(Number(e.target.value))}
        >
          {books.map((book, idx) => (
            <option key={idx} value={idx}>
              {book[1]}
            </option>
          ))}
        </Select>

        <Select
          value={currentChapterIdx}
          onChange={(e) => setCurrentChapterIdx(Number(e.target.value))}
        >
          {chapters.map((_, idx) => (
            <option key={idx} value={idx}>
              {idx + 1}장
            </option>
          ))}
        </Select>
      </Selector>

      <Content>
        {verses.map((text, idx) => (
          <VerseContainer key={idx}>
            <VerseNumber>{idx + 1}</VerseNumber>
            <VerseText>{text}</VerseText>
          </VerseContainer>
        ))}
      </Content>

      <Navigation style={{ marginTop: "30px", justifyContent: "center" }}>
        <NavButton
          onClick={handlePrevChapter}
          disabled={currentChapterIdx === 0}
        >
          이전 장
        </NavButton>
        <NavButton
          onClick={handleNextChapter}
          disabled={currentChapterIdx === chapters.length - 1}
        >
          다음 장
        </NavButton>
      </Navigation>
    </Container>
  );
};

export default BibleViewer;
