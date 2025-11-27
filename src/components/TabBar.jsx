// src/components/TabBar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { BookOpen, Settings } from "lucide-react";
import { useSelector } from "react-redux";

const TabBarWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;
  padding-bottom: env(safe-area-inset-bottom);
  background-color: ${(props) => (props.isDarkMode ? "#1a1a1a" : "#fff")};
`;

const TabItem = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 100%;
  text-decoration: none;
  color: ${(props) => (props.isActive ? "#0066cc" : "#999")};
  font-size: 12px;
  font-weight: ${(props) => (props.isActive ? "600" : "500")};
  transition: color 0.3s;

  &:hover {
    color: #0066cc;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const TabBar = ({ currentPath }) => {
  const isDarkMode = useSelector((state) => state.ui.isDarkMode);

  return (
    <TabBarWrapper isDarkMode={isDarkMode}>
      <TabItem to="/" isActive={currentPath === "/"}>
        <BookOpen size={24} />
        <span>읽기</span>
      </TabItem>

      <TabItem to="/settings" isActive={currentPath === "/settings"}>
        <Settings size={24} />
        <span>설정</span>
      </TabItem>
    </TabBarWrapper>
  );
};

export default TabBar;
