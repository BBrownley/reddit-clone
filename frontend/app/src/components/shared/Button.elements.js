import styled, { keyframes } from "styled-components";

const scrollUp = keyframes`
  0% { transform: translateY(0%); }
	100% { transform: translateY(-50%); }
`;

export const Button = styled.div`
  display: inline-block;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.cornflowerBlue};
  padding: 5px;
  transition: 0.2s all ease-out;
  position: relative;
  overflow: hidden;
  /* width: 150px; */
  user-select: none;

  ${props => {
    switch (props.color) {
      case "blue":
        return `
          background-color: ${props.theme.cornflowerBlue};
          color: white;
          border: 1px solid ${props.theme.cornflowerBlue}
        `;
      case "pink-primary":
        return `
          background-color: ${props.theme.persianPink};
          color: white;
          border: 1px solid ${props.theme.persianPink};
          &:hover {
            color: white;
          }
        `;
      // case "pink-secondary":
      //   return `
      //     border: 1px solid ${props.theme.persianPink};
      //   `;
    }
  }}

  ${props => {
    switch (props.size) {
      case "fill":
        return `display: block;`;
      default:
        return `width: 150px;`;
    }
  }}

  &:hover {
    cursor: pointer;
  }
`;

export const InvisText = styled.span`
  color: transparent;
`;

export const Container = styled.div`
  text-align: center;
  position: absolute;
  top: 2px;
  left: -1px;
  width: 100%;
  line-height: 1.8;
  & > * {
    display: block;
  }
  &:hover {
    ${props => {
      switch (props.color) {
        case "blue":
          return `
          color: white;
        `;
        case "pink-primary":
          return `
          color: white;
        `;
        // case "pink-secondary":
        // return `
        //   color: ${props.theme.persianPink};
        // `;
      }
    }}
    animation: ${scrollUp} 0.2s ease-in-out;
    animation-fill-mode: forwards;
  }
`;
