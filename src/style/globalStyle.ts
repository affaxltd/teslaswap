import { color } from "./constants/color";
import { createGlobalStyle } from "styled-components";
import { primaryBg } from "./themes/theme";

export const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    transition-property: box-shadow, background-color, border-color, color, fill, stroke;
    transition-duration: 175ms;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'Inter var', sans-serif;
  }

  body > img {
    display: none;
  }

  html {
    
  background: ${primaryBg};
  }

  #nprogress .bar {
    background: ${color("theme")}
  }

  #nprogress .peg {
    box-shadow: 0 0 10px ${color("theme")}, 0 0 5px ${color("theme")};
  }
`;
