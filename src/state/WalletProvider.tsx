import Button, { ButtonImg, Iconify } from "../components/base/Button";
import { CheckCircleOutline, ExclamationCircleOutline, X } from "heroicons-react";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { animated, useTransition } from "react-spring";
import { darkColor, getColor } from "../style/constants/color";

import Card from "../components/base/Card";
import { Divider } from "../components/base/Divider";
import Horizontal from "../components/base/Horizontal";
import IconC from "../components/base/Icon";
import Spinner from "../components/base/Spinner";
import { Text } from "../components/base/Text";
import Vertical from "../components/base/Vertical";
import { createPortal } from "react-dom";
import { ethers } from "ethers";
import { providers } from "../lib/web3/providers";
import { px } from "../style/helpers/measurements";
import { radius } from "../style/constants/measurements";
import { springConfig } from "../style/constants/spring";
import styled from "styled-components";
import { text } from "../style/themes/theme";
import { useOutsideAlerter } from "../lib/hooks/use-outside-alerter";
import { useRoot } from "./RootProvider";

interface Context {
  open: () => void;
}

export const WalletContext = createContext<Context>({
  open: () => {},
});

export const useWallet = () => useContext(WalletContext);

export const useWeb3 = () => useWeb3React<ethers.providers.Web3Provider>();

const ProviderHolder = styled(animated.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000090;
  z-index: 10;
  transition: none;
`;

const ProviderCard = styled(Card)<{ width: number }>`
  position: relative;
  width: 100%;
  max-width: ${(props) => px(props.width)};
  margin: 0 auto;
`;

const ProviderButton = styled(Button)`
  margin-bottom: 1rem;
`;

const BackButton = styled(Button)`
  width: 100%;
  margin-bottom: 1rem;
`;

const HeaderHolder = styled.div`
  height: 3.2rem;
  display: flex;
`;

const ActiveProvider = styled.div`
  border: 3px solid ${text};
  padding: 1rem;
`;

const ExitHolder = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const XIcon = Iconify(X);

const CustomProvider = ({ children }: PropsWithChildren<{}>) => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(-1);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const root = useRoot();

  const {
    activate,
    active,
    connector,
    deactivate,
    account,
  } = useWeb3React<ethers.providers.Web3Provider>();

  const loadingActive =
    active && loading !== -1 && providers[loading].connector === connector;

  const transitions = useTransition(open, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
  });

  const activeProvider = active
    ? providers.find((v) => v.connector === connector) || null
    : null;

  useOutsideAlerter(
    cardRef,
    () => {
      if (loading !== -1) return;
      setOpen(false);
    },
    loading
  );

  useEffect(() => {
    if (loading === -1) return;

    (async () => {
      try {
        await activate(providers[loading].connector, undefined, true);
        setOpen(false);
      } catch (_e) {
        setError(true);
      }
    })();
  }, [loading]);

  return (
    <>
      <WalletContext.Provider
        value={{
          open: () => {
            setOpen(true);
            setError(false);
            setLoading(-1);
          },
        }}
      >
        {children}
      </WalletContext.Provider>

      {root &&
        root.ref &&
        createPortal(
          <>
            {transitions.map(
              ({ item, key, props }) =>
                item && (
                  <ProviderHolder key={key} style={props}>
                    <Vertical>
                      <ProviderCard width={400} ref={cardRef}>
                        <ExitHolder>
                          <Button
                            color="transparent"
                            onClick={() => {
                              setOpen(false);
                            }}
                            disableBorder
                          >
                            <XIcon crossOrigin="" path="" />
                          </Button>
                        </ExitHolder>

                        <HeaderHolder>
                          <Text lineHeight={1} large bold>
                            {loading === -1 ? "Provider" : ""}
                          </Text>
                        </HeaderHolder>

                        <Divider size={0.5} vertical />

                        {loading === -1 && (
                          <>
                            {activeProvider && (
                              <>
                                <ActiveProvider>
                                  <Text flex>
                                    <img
                                      src={`/connectors/${activeProvider.logo}.png`}
                                      alt=""
                                      width={24}
                                      height={24}
                                    />
                                    <Divider size={0.75} />
                                    <div>
                                      <Vertical>
                                        Connected with {activeProvider.name}
                                      </Vertical>
                                    </div>
                                  </Text>

                                  <Divider size={1} vertical />

                                  <Text wrap>{account}</Text>
                                </ActiveProvider>

                                <Divider size={1.5} vertical />
                              </>
                            )}

                            {providers.map((provider, index) => {
                              if (provider == activeProvider) return null;

                              return (
                                <ProviderButton
                                  color="transparent"
                                  key={provider.name}
                                  onClick={() => {
                                    if (provider.connector === connector) return;
                                    setLoading(index);
                                  }}
                                  justify="left"
                                  large
                                  textColorHex={provider.color}
                                  active={false}
                                  fullWidth
                                >
                                  <ButtonImg
                                    src={`/connectors/${provider.logo}.png`}
                                    alt=""
                                    large
                                  />

                                  {provider.name}
                                </ProviderButton>
                              );
                            })}

                            {active && (
                              <ProviderButton
                                textColor="red"
                                color="transparent"
                                onClick={() => {
                                  deactivate();
                                }}
                                fullWidth
                              >
                                <XIcon crossOrigin="" path="" color={getColor("red")} />
                                <Divider size={0.25} />
                                Disconnect
                              </ProviderButton>
                            )}
                          </>
                        )}

                        {loading !== -1 && (
                          <>
                            <Horizontal flex>
                              {error ? (
                                <IconC
                                  icon={ExclamationCircleOutline}
                                  color={"red"}
                                  size={80}
                                  sWidth={1}
                                />
                              ) : loadingActive ? (
                                <IconC
                                  icon={CheckCircleOutline}
                                  color={"green"}
                                  size={80}
                                  sWidth={1}
                                />
                              ) : (
                                <Spinner size={80} stroke={2.5} color="text" />
                              )}
                            </Horizontal>

                            <Divider size={1.5} vertical />

                            <Text
                              justify="center"
                              large
                              color={error ? "red" : loadingActive ? "green" : undefined}
                            >
                              {error ? (
                                "Connection error"
                              ) : loadingActive ? (
                                "Connected"
                              ) : (
                                <>
                                  Connecting to{" "}
                                  <span
                                    style={{
                                      color: providers[loading].color,
                                    }}
                                  >
                                    {providers[loading].name}
                                  </span>
                                </>
                              )}
                            </Text>

                            <Divider size={4} vertical />

                            {error && (
                              <>
                                <BackButton
                                  onClick={() => {
                                    setError(false);
                                    setLoading(-1);
                                  }}
                                >
                                  Dismiss
                                </BackButton>
                              </>
                            )}
                          </>
                        )}
                      </ProviderCard>
                    </Vertical>
                  </ProviderHolder>
                )
            )}
          </>,
          root.ref
        )}
    </>
  );
};

const WalletProvider = ({ children }: PropsWithChildren<{}>) => (
  <Web3ReactProvider
    getLibrary={(provider, _connector) => {
      return new ethers.providers.Web3Provider(provider);
    }}
  >
    <CustomProvider>{children}</CustomProvider>
  </Web3ReactProvider>
);

export default WalletProvider;
