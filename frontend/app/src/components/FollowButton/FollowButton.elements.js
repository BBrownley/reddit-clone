import styled, { keyframes, css } from "styled-components";
import { PillButton, Container } from "../shared/PillButton.elements";

export const StyledPillButton = styled(PillButton)`
  border: 1px solid #fc74a4;
  height: 2rem;
  width: 150px;
  margin-bottom: -3px;
  transform: translateY(-0.25rem);
  user-select: none;
  margin: 10px 10px 0 10px;
  margin-left: auto;
  font-family: inherit;
  &:hover {
    cursor: pointer;
  }
  ${props => {
    switch (props.color) {
      case "pink-primary":
        return css`
          color: white;
        `;
      case "pink-secondary":
        return css`
          font-weight: bold;
          background: white;
          color: ${props.theme.persianPink};
        `;
    }
  }}
`;

export const StyledContainer = styled(Container)`
  & > * {
    display: block;
  }
  /* &:hover {
    ${props => {
      switch (props.color) {
        case "pink-primary":
          return css`
            color: white;
          `;
        case "pink-secondary":
          return css`
            background: white;
            color: ${props.theme.persianPink};
          `;
      }
    }}
  } */
`;

export { InvisText } from "../shared/PillButton.elements";
