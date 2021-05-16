import styled, { keyframes } from "styled-components";
import { Button, Container } from "../shared/Button.elements";

export const StyledButton = styled(Button)`
  border: 1px solid #fc74a4;
  width: 150px;
  margin-bottom: -3px;
  transform: translateY(-0.25rem);
  user-select: none;
  margin: 10px 10px 0 10px;
  margin-left: auto;
  &:hover {
    cursor: pointer;
  }
`;

export const StyledContainer = styled(Container)`
  & > * {
    display: block;
  }
  &:hover {
    ${props => {
      switch (props.color) {
        case "pink-primary":
          return `
          color: white;
        `;
        case "pink-secondary":
          return `
          color: ${props.theme.persianPink};
        `;
      }
    }}
  }
`;

export { InvisText } from "../shared/Button.elements";
