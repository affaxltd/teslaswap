import Container from "../base/Container";
import { Divider } from "../base/Divider";
import Link from "next/link";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import WalletButton from "./WalletButton";
import { siteName } from "../../data/site";
import styled from "styled-components";
import { text } from "../../style/themes/theme";

const Head = styled.header`
  padding: 1.5rem 0;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Title = styled.p`
  display: flex;
  cursor: pointer;
  color: ${text};
  font-weight: 700;
  font-size: 2rem;
  line-height: 3.25rem;
  background: transparent;
  border: none;

  &:focus {
    outline: none;
  }
`;

const ButtonTray = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const Header = () => (
  <Head>
    <Container>
      <HeaderWrapper>
        <Link href="/">
          <Title>{siteName}</Title>
        </Link>

        <ButtonTray>
          <ThemeSwitch />

          <Divider size={0.75} />

          <WalletButton />
        </ButtonTray>
      </HeaderWrapper>
    </Container>
  </Head>
);

export default Header;
