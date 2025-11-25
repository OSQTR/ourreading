// src/Footer.jsx

import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  font-family: "Noto Serif KR", sans-serif;
  h5 {
    font-weight: 400;
    color: #555;
  }
  a {
    text-decoration: none;
    color: #0066cc;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <h5>
        성경 본문 저작권은{" "}
        <a
          href="https://www.bskorea.or.kr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          대한성서공회에게
        </a>{" "}
        있습니다. <br />
        개인적인 사용만 허락합니다.
        <br />
        <br />
        made by Viridis Lucidus @{" "}
        <a
          href="https://open.kakao.com/o/gHz2wN7"
          target="_blank"
          rel="noopener noreferrer"
        >
          초보개발자Q&A
        </a>
      </h5>
    </FooterContainer>
  );
};

export default Footer;
