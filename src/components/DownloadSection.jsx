// src/components/DownloadSection.jsx

import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Download, Trash2 } from "lucide-react";
import useDownload from "../hooks/useDownload";

const Container = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const StatusText = styled.p`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #666;

  strong {
    color: #0066cc;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background: linear-gradient(90deg, #0066cc, #46cdcf);
  transition: width 0.3s ease;
  border-radius: 6px;
`;

const PercentageText = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #0066cc;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const DownloadButton = styled(Button)`
  background: #0066cc;
  color: white;

  &:hover:not(:disabled) {
    background: #0052a3;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const ClearButton = styled(Button)`
  background: #f0f0f0;
  color: #333;

  &:hover:not(:disabled) {
    background: #e0e0e0;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const InfoText = styled.p`
  margin: 12px 0 0 0;
  font-size: 12px;
  color: #999;
`;

const DownloadSection = () => {
  // Redux에서 직접 books 구독
  const { books } = useSelector((state) => state.bible);

  const {
    isDownloading,
    downloadPercentage,
    currentProgress,
    totalBooks,
    cachedCount,
    startDownload,
    clearCache,
  } = useDownload(books);

  return (
    <Container>
      <Title>📚 성경 본문 미리받기</Title>

      <StatusText>
        캐시: <strong>{cachedCount}</strong> / {totalBooks} 권
      </StatusText>

      <ProgressBarContainer>
        <ProgressBar percentage={downloadPercentage} />
      </ProgressBarContainer>

      <PercentageText>{downloadPercentage}%</PercentageText>

      {isDownloading && (
        <StatusText>
          다운로드 중... ({currentProgress}/{totalBooks})
        </StatusText>
      )}

      <ButtonContainer>
        <DownloadButton
          onClick={startDownload}
          disabled={isDownloading || downloadPercentage === 100}
        >
          <Download size={18} />
          {isDownloading ? "다운로드 중..." : "전체 미리받기"}
        </DownloadButton>

        <ClearButton
          onClick={() => {
            if (window.confirm("캐시된 모든 성경 본문을 삭제하시겠습니까?")) {
              clearCache();
            }
          }}
          disabled={isDownloading || cachedCount === 0}
        >
          <Trash2 size={18} />
          캐시 삭제
        </ClearButton>
      </ButtonContainer>

      <InfoText>
        💡 미리받기 후 인터넷 연결 없이도 성경을 읽을 수 있습니다.
      </InfoText>
    </Container>
  );
};

export default DownloadSection;
