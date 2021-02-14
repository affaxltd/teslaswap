import { Colors, color, darkColor } from "../../style/constants/color";
import { SizeProps, px, rem, sizeMap } from "../../style/helpers/measurements";
import { contrastText, text } from "../../style/themes/theme";
import styled, { ThemedStyledFunction } from "styled-components";

import { ComponentType } from "react";

export type Justify = "center" | "left" | "right" | "flex-end";

type TType = keyof JSX.IntrinsicElements | ComponentType<any>;

interface TextProps extends SizeProps {
  color?: Colors;
  contrast?: boolean;
  flex?: boolean;
  nowrap?: boolean;
  wrap?: boolean;
  justify?: Justify;
  bold?: boolean;
  thicc?: boolean;
  lineHeight?: number;
  uppercase?: boolean;
  clickable?: boolean;
}

const map = sizeMap("medium", px, 12, 16, 20);

function Textify<T extends TType>(t: ThemedStyledFunction<T, any, {}, never>) {
  return t<TextProps>`
    ${(props) => (props.lineHeight ? `line-height: ${rem(props.lineHeight)}` : "")};
    ${(props) => (props.flex ? "display: flex" : "")};
    ${(props) => (props.nowrap ? "white-space: nowrap" : "")};
    cursor: ${(props) => (props.clickable ? "pointer" : "text")};
    ${(props) =>
      props.justify
        ? `
        justify-content: ${props.justify};
        text-align: ${props.justify};
      `
        : ""};
    ${(props) =>
      props.wrap
        ? `
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      `
        : ""};
    ${(props) => (props.uppercase ? "text-transform: uppercase" : "")};
    font-weight: ${(props) => (props.thicc ? 700 : props.bold ? 600 : 400)};
    font-size: ${map};
    color: ${(props) =>
      props.color
        ? props.contrast
          ? darkColor(props.color)(props)
          : color(props.color)(props)
        : props.contrast
        ? contrastText(props)
        : text(props)};
  `;
}

interface HugeProps {
  thicc?: boolean;
  enormous?: boolean;
  widthCheck?: number;
  checkSize?: number;
}

const hugeMap = sizeMap("medium", px, 27.5, 35, 60);

function HugeTextify<T extends TType>(t: ThemedStyledFunction<T, any, {}, never>) {
  return styled(Textify(t))<HugeProps>`
    font-size: ${(props) => (props.enormous ? px(75) : hugeMap(props))} !important;
    font-weight: ${(props) => (props.thicc ? 800 : props.bold ? 600 : 400)} !important;

    @media (max-width: ${(props) => px(props.widthCheck || 0)}) {
      font-size: ${(props) => px(props.checkSize || 0)} !important;
    }
  `;
}

export const Text = Textify(styled.p);

export const HugeText = HugeTextify(styled.p);
export const H1Text = HugeTextify(styled.h1);
export const H3Text = HugeTextify(styled.h3);
export const H5Text = HugeTextify(styled.h5);

export const Strong = styled.strong`
  color: ${text};
`;

interface SpanProps {
  color?: Colors;
  link?: boolean;
}

export const Span = styled.span<SpanProps>`
  color: ${(props) => (props.color ? color(props.color)(props) : text(props))};
  cursor: ${(props) => (props.link ? "pointer" : "text")};
`;
