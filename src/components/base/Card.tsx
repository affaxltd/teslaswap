import { secondaryBg, text } from "../../style/themes/theme";

import { memeShadow } from "../../style/constants/shadow";
import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 2rem;
  background-color: ${secondaryBg};
  border: ${text} 3px solid;
  box-shadow: ${memeShadow};
  z-index: 10;
`;

export default Card;
