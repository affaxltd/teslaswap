import { useWallet, useWeb3 } from "../../state/WalletProvider";

import Button from "../base/Button";
import { Jazzicon } from "@ukstv/jazzicon-react";
import React from "react";
import { normalShadow } from "../../style/constants/shadow";
import styled from "styled-components";

const WalletAvatar = styled(Jazzicon)`
  margin-left: 0 !important;
  margin-right: 0.75rem;
  cursor: pointer;
  width: 32px;
  height: 32px;

  & > div {
    box-shadow: ${normalShadow};
  }
`;

const WalletButton = () => {
  const { active, account } = useWeb3();
  const { open } = useWallet();

  return active && account ? (
    <Button color="transparent" onClick={open}>
      <WalletAvatar address={account} />
      {account.substr(0, 6)}...{account.substring(account.length - 4)}
    </Button>
  ) : (
    <Button color="transparent" onClick={open}>
      Connect Wallet
    </Button>
  );
};

export default WalletButton;
