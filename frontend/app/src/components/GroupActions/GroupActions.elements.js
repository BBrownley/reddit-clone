import styled, { css } from "styled-components";
import { Button } from "../shared/Button.elements";

export const GroupActions = styled.div`
  display: block;
  width: 100%;

  margin-top: 1rem;
  justify-content: space-between;
  & > * {
    flex: 1;
    margin-right: 2rem;
  }
  & > *:last-child {
    margin-right: 0;
  }

  @media (max-width: 1000px) {
    margin-bottom: -1rem;
    ${props => {
      switch (props.singleGroup) {
        case false:
          return css`
            margin-top: 5rem;
          `;
          break;
        default:
          return css`
            margin-top: 1rem;
          `;
          break;
      }
    }}
  }

  @media (max-width: 630px) {
    flex-direction: column;
    & > * {
      margin-right: 0;
      margin-bottom: 1rem;
    }
    & > *:last-child {
      margin-right: 0;
    }
  }

  ${props => {
    switch (props.singleGroup) {
      case false:
        return css`
          display: flex;
        `;
        break;
      default:
        return css`
          .create-post-button {
            width: 50%;
            @media (max-width: 800px) {
              width: 100%;
            }
          }
        `;
        break;
    }
  }}
`;
