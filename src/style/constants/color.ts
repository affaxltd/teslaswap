import { Theme } from "../themes/theme";
import { ThemedStyledProps } from "styled-components";

export type Colors = "transparent" | "text" | "green" | "red" | "white" | "theme";

export interface Color {
  normal: string;
  dark: string;
}

type ColorFunction = (c: Colors) => (props: ThemedStyledProps<{}, Theme>) => string;

const colorMap = new Map<Colors, Color>([
  [
    "green",
    {
      normal: "#2CE375",
      dark: "#1CD968",
    },
  ],
  [
    "red",
    {
      normal: "#F64049",
      dark: "#F52933",
    },
  ],
  [
    "theme",
    {
      normal: "#1F69FF",
      dark: "#0052F5",
    },
  ],
  [
    "white",
    {
      normal: "#FFFFFF",
      dark: "#CCCCCC",
    },
  ],
]);

export const color: ColorFunction = (c) => (props) => {
  if (c === "transparent") {
    return "transparent";
  }

  if (c === "text") {
    return props.theme.text;
  }

  return colorMap.get(c)?.normal || "";
};

export const darkColor: ColorFunction = (c) => (props) => {
  if (c === "transparent") {
    return props.theme.transparentHighlight;
  }

  if (c === "text") {
    return props.theme.contrastText;
  }

  return colorMap.get(c)?.dark || "";
};

export const getColor = (c: Colors) => colorMap.get(c)?.normal || "";
export const getDarkColor = (c: Colors) => colorMap.get(c)?.dark || "";
