import { AbstractConnector } from "@web3-react/abstract-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export interface Provider {
  connector: AbstractConnector;
  color: string;
  name: string;
  logo: string;
}

const infuraUrl = "https://mainnet.infura.io/v3/affe173c99ca4c36adfa8d3d0b49be77";

export const providers: Provider[] = [
  {
    connector: new InjectedConnector({
      supportedChainIds: [1],
    }),
    color: "#F5841F",
    name: "Metamask",
    logo: "metamask",
  },
  {
    connector: new WalletConnectConnector({
      rpc: { 1: infuraUrl },
    }),
    color: "#3B99FC",
    name: "WalletConnect",
    logo: "walletconnect",
  },
];
