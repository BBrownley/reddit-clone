import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 80rem;
  margin: auto;
  background-color: white;
  min-height: 100vh;
  padding: 2rem;
  overflow: hidden;
  @media (max-width: 1000px) {
    padding-top: 6rem;
  }

  @media (max-width: 600px) {
    padding: 6rem 0.5rem 2rem 0.5rem;
  }
`;

export const Body = styled.div`
  background-color: #eff0f2;
  color: #333;
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  min-height: 100vh;
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
`;
