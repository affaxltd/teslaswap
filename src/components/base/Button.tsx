import { Colors, color, darkColor } from "../../style/constants/color";
import { SizeProps, rem, sizeMap, sizeNoMap } from "../../style/helpers/measurements";

import { Icon } from "../../types/icon";
import { StyleFunction } from "../../style";
import { radius } from "../../style/constants/measurements";
import styled from "styled-components";
import { text } from "../../style/themes/theme";

type Justify = "center" | "left" | "right" | "space-between";

interface ButtonProps extends SizeProps {
  color?: Colors;
  textColor?: Colors;
  textColorHex?: string;
  radius?: number;
  active?: boolean;
  justify?: Justify;
  fullWidth?: boolean;
  inactive?: boolean;
}

interface IconProps extends SizeProps {
  rounded?: boolean;
}

const bgColor: StyleFunction<ButtonProps> = (props) =>
  props.active ? hoverColor(props) : color(props.color || "theme")(props);
const hoverColor: StyleFunction<ButtonProps> = (props) =>
  darkColor(props.color || "theme")(props);

const paddingMap = sizeNoMap("medium", "0 0.7rem", "0.6rem 0.8rem", "0.7rem 1rem");
const fontSizeMap = sizeMap("medium", rem, 0.75, 1, 1.1);
const lineHeightMap = sizeMap("medium", rem, 1.5, 2, 2.6);
const heightMap = sizeMap("medium", rem, 2, 3.2, 4);

const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify ?? "center"};
  text-align: center;
  border: none;
  cursor: ${(props) => (props.inactive ? "default" : "pointer")};
  background: ${(props) =>
    props.inactive ? darkColor("transparent")(props) : bgColor(props)};
  color: ${(props) =>
    props.inactive
      ? text(props)
      : props.textColor || props.textColorHex
      ? props.textColorHex || color(props.textColor || "text")(props)
      : props.color === "transparent"
      ? text(props)
      : "white"};

  ${(props) => (props.fullWidth ? "width: 100%" : "")};

  border-radius: ${(props) => (props.radius ? rem(props.radius) : radius(props))};
  font-weight: 500;
  padding: ${paddingMap};
  font-size: ${fontSizeMap};
  line-height: ${lineHeightMap};
  height: ${heightMap};

  &:hover {
    background: ${(props) =>
      props.inactive ? darkColor("transparent")(props) : hoverColor(props)};
  }

  &:focus {
    outline: none;
  }
`;

const iconSizeMap = sizeMap("medium", rem, 1, 1.4, 1.6);
const marginMap = sizeMap("medium", rem, 0.25, 0.3, 0.5);
const marginRMap = sizeMap("medium", rem, 0.3, 0.6, 0.8);

export const ButtonImg = styled.img<IconProps>`
  width: ${iconSizeMap};
  height: ${iconSizeMap};
  margin: ${marginMap} 0;
  margin-right: ${marginRMap};
  ${(props) => (props.rounded ? "border-radius: 99999px" : "")};
`;

export const ButtonIcon = styled.img<IconProps>`
  width: ${iconSizeMap};
  height: ${iconSizeMap};
  margin: ${marginMap} 0;
  margin-right: ${marginRMap};
  ${(props) => (props.rounded ? "border-radius: 99999px" : "")};
`;

export const Iconify = (icon: Icon, removeMargin?: boolean) => styled(icon)`
  color: ${(props) => (props.color ? props.color : text(props))};
  width: 1.25rem;
  height: 1.25rem;
  margin: ${() => (removeMargin ? "0" : "0.4rem 0.175rem")};

  & * {
    color: ${(props) => (props.color ? props.color : text(props))};
  }
`;

export const PureIconify = (icon: Icon) => styled(icon)`
  color: ${(props) => (props.color ? props.color : text(props))};

  & * {
    color: ${(props) => (props.color ? props.color : text(props))};
  }
`;

export default Button;
