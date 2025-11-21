import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  &:hover {
    border-color: #ddd;
  }
`;

const BibleViewer = ({ bibleData }) => {
  const [currentBookIdx, setCurrentBookIdx] = useState(0);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    if (!bibleData) return;

    const bookChapters = bibleData.chapters.filter(
      (ch) => ch[0] === currentBookIdx
    );
    setChapters(bookChapters);
    setCurrentChapterIdx(0);
  }, [currentBookIdx, bibleData]);

  if (!bibleData || bibleData.books.length === 0) {
    return <Container>데이터를 불러오는 중입니다.</Container>;
  }

  const books = bibleData.books;
  const currentBook = books[currentBookIdx];
  const [bookCode, bookName] = currentBook;
  const currentChapter = chapters[currentChapterIdx];
  const [, verses] = currentChapter || [, []];

  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx(currentChapterIdx - 1);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chapters.length - 1) {
      setCurrentChapterIdx(currentChapterIdx + 1);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Container>
      <Header>
        <HeaderFlex>
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

          <Navigation>
            <NavButton
              onClick={handlePrevChapter}
              disabled={currentChapterIdx === 0}
            >
              <ChevronLeft size={20} />
            </NavButton>

            <NavButton
              onClick={handleNextChapter}
              disabled={currentChapterIdx === chapters.length - 1}
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
