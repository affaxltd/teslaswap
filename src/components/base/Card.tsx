import { largeShadow } from "../../style/constants/shadow";
import { secondaryBg } from "../../style/themes/theme";
import styled from "styled-components";

const Card = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 2rem;
  border-radius: 1rem;
  background-color: ${secondaryBg};
  box-shadow: ${largeShadow};
`;

export default Card;
