import { ArrowCircleUpOutline, ArrowDown } from "heroicons-react";
import { BigNumber, ethers, utils } from "ethers";
import { H1Text, H3Text, HugeText, Span, Text } from "../src/components/base/Text";
import { SentTransaction, useERC20Abi, useTeslaAbi } from "../src/lib/web3/contract";
import {
  chainID,
  etherscan,
  teslaContract,
  teslaTokenAddress,
  usdcDecimals,
  usdcTokenAddress,
} from "../src/lib/web3/addresses";
import { useApprovalWatch, useTeslaOut, useTokenWatch } from "../src/lib/web3/utils";
import { useWallet, useWeb3 } from "../src/state/WalletProvider";

import Button from "../src/components/base/Button";
import Card from "../src/components/base/Card";
import Cleave from "cleave.js/react";
import Container from "../src/components/base/Container";
import { Divider } from "../src/components/base/Divider";
import { Flex } from "../src/components/base/Flex";
import Head from "next/head";
import IconC from "../src/components/base/Icon";
import { OneInchQuote } from "../src/lib/types/quote";
import Spinner from "../src/components/base/Spinner";
import { color } from "../src/style/constants/color";
import { link } from "../src/lib/tools/link";
import { memeShadow } from "../src/style/constants/shadow";
import styled from "styled-components";
import { text } from "../src/style/themes/theme";
import toast from "react-hot-toast";
import { toastStyle } from "../src/style/toastStyle";
import { useInput } from "../src/lib/tools/text";
import useModal from "../src/components/base/Modal";
import useSWR from "swr";
import { useState } from "react";

const Input = styled(Cleave)`
  color: ${text};
  width: 100%;
  font-size: 3rem;
  border: none;
  background: transparent;
  font-weight: 600;

  &:focus {
    outline: none;
  }
`;

const InputContainer = styled.div<{ selected: boolean; error: boolean }>`
  padding: 1.25rem;
  border: 3px
    ${(props) =>
      props.error
        ? color("red")(props)
        : props.selected
        ? color("theme")(props)
        : color("text")(props)}
    solid;
  box-shadow: ${memeShadow};
`;

const OutputContainer = styled.div`
  border: 3px ${color("text")} solid;
  padding: 1.25rem;
  box-shadow: ${memeShadow};
`;

const ConfirmationModal = useModal<{
  usdc: number;
  tesla: number;
  useBalancer: boolean;
}>(({ usdc, tesla, useBalancer, close }) => {
  const [errorMessage, setErrorMsg] = useState<string | null>(null);
  const [tx, setTx] = useState<SentTransaction | null>();
  const [signature, setSignature] = useState("");
  const [deadline, setDeadline] = useState(0);

  const [transacting, setTransacting] = useState(false);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);

  const { active, error, library, account } = useWeb3();

  const usdcContract = useERC20Abi(usdcTokenAddress, library?.getSigner());
  const teslaContr = useTeslaAbi(teslaContract, library?.getSigner());

  return (
    <>
      {!tx && (
        <>
          <HugeText
            style={{
              marginTop: "-0.75rem",
            }}
            thicc
            large
          >
            Swap
          </HugeText>

          <Divider size={2} vertical />

          <Text large bold contrast>
            USDC
          </Text>
          <HugeText thicc>{usdc}</HugeText>

          <Divider size={1.5} vertical />

          <Text large bold contrast>
            sTSLA
          </Text>
          <HugeText thicc>~{tesla.toFixed(8)}</HugeText>

          <Divider size={2} vertical />

          <Text contrast bold large>
            The amount you receive might not match the number on the screen. You might
            receive more or less of sTSLA.
          </Text>

          <Divider size={2} vertical />

          <Flex>
            <Button
              fullWidth
              inactive={signed || !active || error !== undefined || library === undefined}
              disabled={signed || !active || error !== undefined || library === undefined}
              onClick={async () => {
                if (
                  signed ||
                  !active ||
                  !account ||
                  error !== undefined ||
                  library === undefined
                )
                  return;

                try {
                  setSigning(true);
                  setErrorMsg(null);

                  //const deadline = Math.round(new Date().getTime() / 1000 + 48 * 60 * 60);
                  const deadline = 99999999999999;
                  const signer = library.getSigner();

                  setDeadline(deadline);

                  if (signer) {
                    const signature = await signer._signTypedData(
                      {
                        version: "2",
                        name: "USD Coin",
                        chainId: chainID,
                        verifyingContract: usdcTokenAddress,
                      },
                      {
                        Permit: [
                          {
                            name: "owner",
                            type: "address",
                          },
                          {
                            name: "spender",
                            type: "address",
                          },
                          {
                            name: "value",
                            type: "uint256",
                          },
                          {
                            name: "nonce",
                            type: "uint256",
                          },
                          {
                            name: "deadline",
                            type: "uint256",
                          },
                        ],
                      },
                      {
                        owner: account,
                        spender: teslaContract,
                        value: ethers.utils.parseUnits(usdc.toString(), usdcDecimals),
                        nonce: (await usdcContract?.nonces(account || "")) || 0,
                        deadline,
                      }
                    );

                    setSigned(true);
                    setSignature(signature);
                  }
                } catch (e) {
                  const msg = (() => {
                    switch (e.code) {
                      case 4001:
                        return "User cancelled the permit";
                      case -32603:
                        return "Error formatting outputs from RPC";
                      default:
                        return "An unknown error has occured";
                    }
                  })();

                  setErrorMsg(msg);
                } finally {
                  setSigning(false);
                }
              }}
            >
              {signing && <Spinner color="white" size={24} />}

              {!signing && "Sign Permit"}
            </Button>

            <Divider size={3} />

            <Button
              fullWidth
              inactive={
                !signed || !active || error !== undefined || library === undefined
              }
              disabled={
                !signed || !active || error !== undefined || library === undefined
              }
              onClick={async () => {
                if (
                  !signed ||
                  !active ||
                  !account ||
                  error !== undefined ||
                  library === undefined ||
                  transacting ||
                  tx ||
                  !teslaContr
                )
                  return;

                try {
                  setErrorMsg(null);
                  setTransacting(true);

                  const signatureArr = signature.match(/.{1,2}/g) || [];
                  const R_HEX = signatureArr.slice(1, 33);
                  const S_HEX = signatureArr.slice(33, 65);
                  const V_HEX = signatureArr.slice(65, 66);

                  const R_HEX_JOINED = "0x" + R_HEX.join("");
                  const S_HEX_JOINED = "0x" + S_HEX.join("");
                  const V_HEX_JOINED = "0x" + V_HEX.join("");

                  const tx = await teslaContr.exchange(
                    ethers.utils.parseUnits(usdc.toString(), usdcDecimals),
                    useBalancer,
                    deadline,
                    parseInt(V_HEX_JOINED),
                    R_HEX_JOINED,
                    S_HEX_JOINED
                  );

                  setTx(tx);

                  const receipt = await tx.wait(1);
                  const events = receipt.events || [];
                  const event = events[events.length - 1];
                  const result = utils.defaultAbiCoder.decode(
                    ["uint256", "uint256"],
                    event.data
                  );
                  const number = result[1] as BigNumber;

                  toast.success(
                    `Successfully swapped ${usdc} USDC for ${parseFloat(
                      utils.formatUnits(number, 18)
                    ).toFixed(6)} sTSLA!`,
                    toastStyle
                  );
                } catch (e) {
                  const msg = (() => {
                    switch (e.code) {
                      case 4001:
                        return "User cancelled the transaction";
                      case -32603:
                        return "Error formatting outputs from RPC";
                      default:
                        return "An unknown error has occured";
                    }
                  })();

                  setErrorMsg(msg);
                } finally {
                  setTransacting(false);
                }
              }}
            >
              {transacting && <Spinner color="white" size={24} />}

              {!transacting && "Swap"}
            </Button>
          </Flex>

          {errorMessage && (
            <>
              <Divider size={0.75} vertical />

              <Text color="red" bold>
                {errorMessage}
              </Text>
            </>
          )}
        </>
      )}

      {tx && (
        <>
          <Divider size={1} vertical />

          <Flex justify="center">
            <IconC icon={ArrowCircleUpOutline} color="text" size={128} sWidth={1} />
          </Flex>

          <Divider size={2} vertical />

          <HugeText justify="center" small bold>
            Transaction Submitted!
          </HugeText>

          <Divider size={1} vertical />

          <Text
            contrast
            justify="center"
            bold
            clickable
            onClick={link(`https://${etherscan}/tx/${tx.hash || ""}`)}
          >
            View on{" "}
            <Span color="theme" link>
              Etherscan
            </Span>
          </Text>

          <Divider size={3} vertical />

          <Button onClick={close} fullWidth>
            Close
          </Button>
        </>
      )}
    </>
  );
});

const Index = () => {
  const { open } = useWallet();
  const { active, error } = useWeb3();

  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState(false);

  const usdcBalance = useTokenWatch(usdcTokenAddress);
  const tslaBalance = useTokenWatch(teslaTokenAddress[0]);

  const connected = active && !error;

  const balancerOut = useTeslaOut(amount, true);
  const synthetixOut = useTeslaOut(amount, false);

  const { approved, approve, approving, errorMsg, tx } = useApprovalWatch();

  const isZero = balancerOut === 0 && synthetixOut === 0;
  const balancerHigher = balancerOut > synthetixOut;

  const { data } = useSWR<OneInchQuote>(
    `https://api.1inch.exchange/v2.0/quote?fromTokenAddress=0x57Ab1ec28D129707052df4dF418D58a2D46d5f51&toTokenAddress=0x918dA91Ccbc32B7a6A0cc4eCd5987bbab6E31e6D&amount=1000000000000000000000`,
    (url: string) => fetch(url).then((res) => res.json()),
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const isAbove =
    parseInt(
      ethers.utils.parseUnits(amount === "" ? "0" : amount, usdcDecimals).toString()
    ) > parseInt(usdcBalance.toString());

  return (
    <>
      <Head>
        <title>Stonk Swapper</title>
      </Head>

      <ConfirmationModal
        header="Confirm"
        width={400}
        usdc={amount === "" ? 0 : parseFloat(amount)}
        tesla={balancerHigher ? balancerOut : synthetixOut}
        useBalancer={balancerHigher}
      >
        {({ setState }) => (
          <Container maxWidth={800}>
            <Divider size={2} vertical />

            <H1Text large thicc justify="center">
              Swap USDC to sTSLA
            </H1Text>

            <H3Text contrast justify="center" bold small>
              Quickly trade your boring USDC to spicy hot sTSLA, a Synthetix Synth for
              Tesla stocks!
            </H3Text>

            <Divider size={6} vertical />

            <Container noPadding maxWidth={450}>
              <Card>
                {connected && (
                  <>
                    <HugeText small bold>
                      $sTSLA Price:
                    </HugeText>
                    <HugeText large thicc>
                      {!data
                        ? "..."
                        : `${parseFloat(
                            (
                              parseInt(data.fromTokenAmount || "1") /
                              parseInt(data.toTokenAmount || "1")
                            ).toString()
                          ).toFixed(2)}$`}
                    </HugeText>

                    <Divider size={2} vertical />

                    <InputContainer selected={selected} error={isAbove}>
                      <Flex justify="space-between">
                        <div>
                          <HugeText bold small>
                            Input
                          </HugeText>
                        </div>

                        <div>
                          <Text
                            bold
                            contrast
                            clickable
                            justify="right"
                            onClick={() => {
                              if (usdcBalance === "...") return;
                              setAmount(
                                parseFloat(
                                  ethers.utils.formatUnits(usdcBalance, usdcDecimals)
                                ).toFixed(6)
                              );
                            }}
                          >
                            <Divider size={0.5} />
                            {usdcBalance === "..." ? (
                              <Spinner color="text" size={18} />
                            ) : (
                              `Balance: ${parseFloat(
                                ethers.utils.formatUnits(usdcBalance, usdcDecimals)
                              ).toFixed(6)} USDC`
                            )}
                          </Text>
                        </div>
                      </Flex>

                      <Divider size={1} vertical />

                      <Input
                        aria-label="investment"
                        placeholder="0.00"
                        options={{
                          numeral: true,
                          numeralThousandsGroupStyle: "none",
                          numeralDecimalScale: 6,
                        }}
                        value={amount}
                        onChange={useInput(
                          setAmount,
                          (v) => !v.includes("-") && !(v.length === 1 && v === ".")
                        )}
                        onSelect={() => setSelected(true)}
                        onBlur={() => setSelected(false)}
                      />
                    </InputContainer>

                    {isAbove && (
                      <>
                        <Divider size={0.5} vertical />

                        <Text color="red" bold>
                          Not enough tokens
                        </Text>
                      </>
                    )}

                    <Divider size={1.5} vertical />

                    <Flex justify="center">
                      <IconC icon={ArrowDown} color="text" size={24} />
                    </Flex>

                    <Divider size={1.5} vertical />

                    <OutputContainer>
                      <Flex justify="space-between">
                        <div>
                          <HugeText thicc small>
                            Output
                          </HugeText>
                        </div>

                        <div>
                          <Text bold contrast justify="right">
                            <Divider size={0.5} />
                            {tslaBalance === "..." ? (
                              <Spinner color="text" size={18} />
                            ) : (
                              `Balance: ${parseFloat(
                                ethers.utils.formatUnits(tslaBalance, 18)
                              ).toFixed(6)} sTSLA`
                            )}
                          </Text>
                        </div>
                      </Flex>

                      <Divider size={0.5} vertical />

                      <HugeText large thicc>
                        {!connected || isZero || amount === "" || parseFloat(amount) <= 0
                          ? "0"
                          : (balancerHigher ? balancerOut : synthetixOut).toFixed(4)}
                      </HugeText>

                      <Divider size={0.5} vertical />

                      <Text contrast large bold>
                        Best price from{" "}
                        <Span
                          color="theme"
                          onClick={() => {
                            if (isZero) return;
                            link(
                              balancerHigher
                                ? "https://balancer.exchange/#/swap"
                                : "https://www.synthetix.io/"
                            )();
                          }}
                          link={!isZero}
                        >
                          {isZero ? "..." : balancerHigher ? "Balancer" : "Synthetix"}
                        </Span>
                      </Text>
                    </OutputContainer>

                    <Divider size={2} vertical />
                  </>
                )}

                {!connected && (
                  <>
                    <HugeText thicc justify="center">
                      Please connect before trading.
                    </HugeText>
                    <Divider size={2} vertical />
                  </>
                )}

                <Button
                  fullWidth
                  onClick={() => {
                    if (!connected) return open();

                    if (
                      approving ||
                      isAbove ||
                      (connected && (isZero || amount === "" || parseFloat(amount) <= 0))
                    )
                      return;

                    if (!approved && !balancerHigher) return approve();

                    setState(true);
                  }}
                  disabled={
                    approving ||
                    isAbove ||
                    (connected && (isZero || amount === "" || parseFloat(amount) <= 0))
                  }
                  inactive={
                    approving ||
                    isAbove ||
                    (connected && (isZero || amount === "" || parseFloat(amount) <= 0))
                  }
                >
                  {!connected ? (
                    "Connect Wallet"
                  ) : approving ? (
                    <Spinner color={approving ? "text" : "white"} size={24} />
                  ) : !approved && !balancerHigher ? (
                    "Approve Swap"
                  ) : (
                    "Swap!"
                  )}
                </Button>

                {errorMsg && (
                  <>
                    <Divider size={0.75} vertical />

                    <Text color="red" bold>
                      {errorMsg}
                    </Text>
                  </>
                )}

                {tx && approving && (
                  <>
                    <Divider size={0.75} vertical />

                    <Text
                      contrast
                      bold
                      clickable
                      onClick={link(`https://${etherscan}/tx/${tx.hash || ""}`)}
                    >
                      Approving Synthetix swap on{" "}
                      <Span color="theme" link>
                        Etherscan
                      </Span>
                    </Text>
                  </>
                )}
              </Card>
            </Container>

            <Divider size={2} vertical />
          </Container>
        )}
      </ConfirmationModal>
    </>
  );
};

export default Index;
