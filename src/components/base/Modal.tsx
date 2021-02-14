import Button, { Iconify } from "./Button";
import React, {
  ComponentType,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { animated, useTransition } from "react-spring";

import Card from "./Card";
import { Divider } from "./Divider";
import { Text } from "./Text";
import Vertical from "./Vertical";
import { X } from "heroicons-react";
import { createPortal } from "react-dom";
import { px } from "../../style/helpers/measurements";
import { springConfig } from "../../style/constants/spring";
import styled from "styled-components";
import { useRoot } from "../../state/RootProvider";

const ModalHolder = styled(animated.div)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #00000090;
  z-index: 10;
  transition: none;
`;

const ModalCard = styled(Card)<{ width: number }>`
  position: relative;
  width: 100%;
  max-width: ${(props) => px(props.width)};
  margin: 0 auto;
`;

const ExitHolder = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const XIcon = Iconify(X);

export const useModal = <T extends unknown>(
  Component: ComponentType<
    T & {
      close: () => void;
    }
  >
) => (
  prop: T & {
    width?: number;
    header?: string;
    children:
      | ReactNode
      | ((v: { setState: Dispatch<SetStateAction<boolean>> }) => ReactNode);
    disableX?: boolean;
  }
) => {
  const [open, setOpen] = useState(false);
  const root = useRoot();

  const { children, header, width, disableX } = prop;

  const transitions = useTransition(open, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: springConfig,
  });

  return (
    <>
      {typeof children !== "function" && (
        <div
          onClick={() => {
            setOpen(true);
          }}
        >
          {children}
        </div>
      )}

      {typeof children === "function" && (
        <>
          {children({
            setState: setOpen,
          })}
        </>
      )}

      {root &&
        root.ref &&
        createPortal(
          <>
            {transitions.map(
              ({ item, key, props }) =>
                item && (
                  <ModalHolder key={key} style={props}>
                    <Vertical>
                      <ModalCard width={width || 20}>
                        {!disableX && (
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
                        )}

                        {header && (
                          <>
                            <Text large bold>
                              {header}
                            </Text>
                            <Divider size={1} vertical />
                          </>
                        )}

                        <Component
                          close={() => {
                            setOpen(false);
                          }}
                          {...prop}
                        />
                      </ModalCard>
                    </Vertical>
                  </ModalHolder>
                )
            )}
          </>,
          root.ref
        )}
    </>
  );
};

export default useModal;
