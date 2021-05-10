import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    transform: translateY(1rem);
    opacity: 0;
  }

  10% {
    transform: translateY(0);
    opacity: 1;
  }

  90% {
    transform: translateY(0);
    opacity: 1;
  }

  100% {
    transform: translateY(1rem);
    opacity: 0;
  }
`;

export const Container = styled.div`
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  color: white;
  background-color: #61e786;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${fadeIn} 5s ease;
  .progress {
    position: absolute;
    bottom: 0;
    left: 0;
    content: "";
    width: 100%;
    .progressbar-progress {
      background-color: #ccc;
    }
  }
  .fa-close {
    &:hover {
      cursor: pointer;
    }
  }
`;
