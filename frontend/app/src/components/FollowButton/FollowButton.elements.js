import styled, { keyframes } from "styled-components";

const scrollUp = keyframes`
  0% { transform: translateY(0%); }
	100% { transform: translateY(-50%); }
`;

export const Button = styled.div`
  display: inline-block;
  border-radius: 3px;
  border: 1px solid #fc74a4;
  padding: 5px;
  transition: 0.2s all ease-out;
  position: relative;
  overflow: hidden;
  width: 150px;
  user-select: none;
  margin: 10px 10px 0 10px;
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
    color: #fc74a4;
    animation: ${scrollUp} 0.2s ease-in-out;
    animation-fill-mode: forwards;
  }
`;
