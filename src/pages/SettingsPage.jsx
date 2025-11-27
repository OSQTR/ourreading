// src/pages/SettingsPage.jsx
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import useDownload from "../hooks/useDownload";
import {
  setFontSize,
  setFontFamily,
  setDarkMode,
} from "../store/features/uiSlice";
import Footer from "../Footer";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 80px 16px 80px;
  background-color: ${(props) => (props.isDarkMode ? "#1a1a1a" : "#fff")};
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  font-family: ${(props) => props.fontFamily || "Noto Serif KR"}, serif;
`;

const Section = styled.section`
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${(props) => (props.isDarkMode ? "#333" : "#eee")};

  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 14px;
  color: ${(props) => (props.isDarkMode ? "#bbb" : "#666")};
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.isDarkMode ? "#444" : "#ddd")};
  border-radius: 4px;
  background-color: ${(props) =>
    props.isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#f5f5f5"};
  color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  cursor: pointer;
  font-size: 14px;
  font-family: ${(props) => props.fontFamily || "system-ui"};

  option {
    background-color: ${(props) => (props.isDarkMode ? "#2a2a2a" : "white")};
    color: ${(props) => (props.isDarkMode ? "#e0e0e0" : "#333")};
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${(props) => (props.isDarkMode ? "#333" : "#ddd")};
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0066cc;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #0066cc;
    cursor: pointer;
    border: none;
  }
`;

const Toggle = styled.input`
  width: 48px;
  height: 28px;
  appearance: none;
  -webkit-appearance: none;
  background: ${(props) => (props.checked ? "#0066cc" : "#ccc")};
  outline: none;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  transition: background 0.3s;

  &:after {
    content: "";
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${(props) => (props.checked ? "22px" : "2px")};
    transition: left 0.3s;
  }
`;

const ValueDisplay = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #0066cc;
  min-width: 40px;
  text-align: right;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${(props) =>
    props.variant === "danger" ? "#ff4757" : "#0066cc"};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${(props) => (props.isDarkMode ? "#333" : "#eee")};
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #0066cc;
  width: ${(props) => props.percentage}%;
  transition: width 0.3s;
`;

const ProgressText = styled.div`
  font-size: 12px;
  color: ${(props) => (props.isDarkMode ? "#999" : "#666")};
  text-align: center;
`;

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { fontSize, fontFamily, isDarkMode } = useSelector((state) => state.ui);
  const { books } = useSelector((state) => state.bible);

  const {
    isDownloading,
    downloadPercentage,
    currentProgress,
    totalBooks,
    cachedCount,
    totalCachedBooks,
    startDownload,
    clearCache,
  } = useDownload(books);

  const handleFontSizeChange = useCallback(
    (e) => {
      const size = Number(e.target.value);
      dispatch(setFontSize(size));
    },
    [dispatch]
  );

  const handleFontFamilyChange = useCallback(
    (e) => {
      dispatch(setFontFamily(e.target.value));
    },
    [dispatch]
  );

  const handleDarkModeToggle = useCallback(
    (e) => {
      dispatch(setDarkMode(e.target.checked));
    },
    [dispatch]
  );

  return (
    <Container isDarkMode={isDarkMode} fontFamily={fontFamily}>
      {/* 글자 설정 섹션 */}
      <Section isDarkMode={isDarkMode}>
        <SectionTitle isDarkMode={isDarkMode}>글자 설정</SectionTitle>

        <SettingItem>
          <Label isDarkMode={isDarkMode}>글자 크기</Label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
            }}
          >
            <Slider
              type="range"
              min="12"
              max="24"
              value={fontSize}
              onChange={handleFontSizeChange}
              isDarkMode={isDarkMode}
            />
            <ValueDisplay>{fontSize}px</ValueDisplay>
          </div>
        </SettingItem>

        <SettingItem>
          <Label isDarkMode={isDarkMode}>폰트</Label>
          <Select
            value={fontFamily}
            onChange={handleFontFamilyChange}
            isDarkMode={isDarkMode}
            fontFamily={fontFamily}
          >
            <option value="Noto Serif KR">Noto Serif KR</option>
            <option value="Noto Sans KR">Noto Sans KR</option>
            <option value="Georgia">Georgia</option>
            <option value="Arial">Arial</option>
          </Select>
        </SettingItem>
      </Section>

      {/* 다크모드 섹션 */}
      <Section isDarkMode={isDarkMode}>
        <SectionTitle isDarkMode={isDarkMode}>화면 설정</SectionTitle>

        <SettingItem>
          <Label isDarkMode={isDarkMode}>다크모드</Label>
          <Toggle
            type="checkbox"
            checked={isDarkMode}
            onChange={handleDarkModeToggle}
          />
        </SettingItem>
      </Section>

      {/* 다운로드 섹션 */}
      <Section isDarkMode={isDarkMode}>
        <SectionTitle isDarkMode={isDarkMode}>성경 다운로드</SectionTitle>

        <SettingItem>
          <Label isDarkMode={isDarkMode}>캐시된 책</Label>
          <ValueDisplay>
            {cachedCount}/{totalCachedBooks}
          </ValueDisplay>
        </SettingItem>

        <ProgressBar isDarkMode={isDarkMode}>
          <ProgressFill percentage={downloadPercentage} />
        </ProgressBar>

        <ProgressText isDarkMode={isDarkMode}>
          {downloadPercentage}% 다운로드 완료
        </ProgressText>

        {isDownloading && (
          <ProgressText isDarkMode={isDarkMode}>
            {currentProgress}/{totalBooks}
          </ProgressText>
        )}

        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button
            onClick={startDownload}
            disabled={isDownloading}
            style={{ flex: 1 }}
          >
            {isDownloading ? "다운로드 중..." : "전체 다운로드"}
          </Button>

          <Button
            onClick={clearCache}
            variant="danger"
            disabled={isDownloading || cachedCount === 0}
            style={{ flex: 1 }}
          >
            캐시 삭제
          </Button>
        </div>
        <div style={{ marginTop: "16px", gap: "8px" }}>
          <Footer />
        </div>
      </Section>
    </Container>
  );
};

export default SettingsPage;
