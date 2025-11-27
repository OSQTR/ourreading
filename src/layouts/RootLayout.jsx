// src/layouts/RootLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import TabBar from "../components/TabBar";

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  height: 100vh;
  width: 100%;
  background-color: ${(props) => (props.isDarkMode ? "#1a1a1a" : "#fff")};
  color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
  transition: background-color 0.3s, color 0.3s;
`;

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  /* 스크롤바 커스터마이징 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${(props) => (props.isDarkMode ? "#2a2a2a" : "#f1f1f1")};
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => (props.isDarkMode ? "#555" : "#888")};
    border-radius: 4px;

    &:hover {
      background: ${(props) => (props.isDarkMode ? "#777" : "#555")};
    }
  }
`;

const TabBarContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 600px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => (props.isDarkMode ? "#1a1a1a" : "#fff")};
  border-top: 1px solid ${(props) => (props.isDarkMode ? "#333" : "#ddd")};
  z-index: 1000;
`;

const RootLayout = () => {
  const location = useLocation();
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  return (
    <LayoutContainer isDarkMode={isDarkMode}>
      {/* 메인 콘텐츠 영역 - Outlet */}
      <MainContent isDarkMode={isDarkMode}>
        <Outlet />
      </MainContent>

      {/* 탭바 - 항상 하단에 고정 */}
      <TabBarContainer isDarkMode={isDarkMode}>
        <TabBar currentPath={location.pathname} />
      </TabBarContainer>
    </LayoutContainer>
  );
};

export default RootLayout;
