import styled from "styled-components";

export const Container = styled.div`
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 10px 10px 37px 14px rgba(0, 0, 0, 0.11);
  -webkit-box-shadow: 10px 10px 37px 14px rgba(0, 0, 0, 0.11);
  -moz-box-shadow: 10px 10px 37px 14px rgba(0, 0, 0, 0.11);
  padding: 1rem;
  position: absolute;
  top: 3rem;
  left: -1rem;
  z-index: 10000;
  transform: translateY(1rem) translateX(-2rem);
  text-align: center;
  .modal-buttons {
    display: flex;
    > * {
      margin: 0.5rem;
    }
  }
`;
