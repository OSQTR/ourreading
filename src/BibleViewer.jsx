import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useBibleData from "./hooks/useBibleData";
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

const BibleViewer = () => {
  // 훅을 사용하여 데이터 상태와 로딩 함수를 가져옵니다.
  const { books, currentBookData, loadBook, isLoading } = useBibleData();

  // books 배열의 index (0~65)
  const [currentBookIdx, setCurrentBookIdx] = useState(0);
  // 현재 책 내의 chapter index
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);

  // 현재 선택된 책의 '코드' (meta.json 기준)
  const currentBookCode = books[currentBookIdx]?.[0];

  // 책이 바뀌면 (currentBookIdx 변경), 해당 책 데이터를 로드하는 효과
  useEffect(() => {
    // books가 로드되고, 현재 책 코드가 유효할 때만 실행
    if (currentBookCode !== undefined) {
      loadBook(currentBookCode); // 캐시 또는 네트워크에서 로드
      setCurrentChapterIdx(0); // 새 책 로딩 시 항상 1장으로 초기화
    }
  }, [currentBookCode, loadBook]);

  // 메타데이터 로딩 중이거나, 책 목록이 비어있을 때
  if (isLoading || books.length === 0) {
    return <Container>책 목록 데이터를 불러오는 중입니다.</Container>;
  }

  // 현재 책의 장(chapters)과 절(verses) 데이터
  const chapters = currentBookData?.chapters || [];
  const verses = chapters[currentChapterIdx] || [];
  const chaptersLength = chapters.length;

  // 현재 책 데이터가 로딩되지 않았을 때 (책 선택 후 로딩 중일 때)
  if (!currentBookData) {
    return (
      <Container>
        {books[currentBookIdx][1]} 데이터를 로딩 중입니다...
      </Container>
    );
  }

  // --- 핸들러 함수 ---
  const handlePrevChapter = () => {
    if (currentChapterIdx > 0) {
      setCurrentChapterIdx(currentChapterIdx - 1);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  };

  const handleNextChapter = () => {
    if (currentChapterIdx < chaptersLength - 1) {
      // chaptersLength 사용
      setCurrentChapterIdx(currentChapterIdx + 1);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
              disabled={!currentBookData} // 책 데이터 로딩 전에는 장 선택 비활성화
            >
              {/* chapters 배열 길이만큼 옵션 생성 */}
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
              disabled={currentChapterIdx === chaptersLength - 1} // chaptersLength 사용
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
