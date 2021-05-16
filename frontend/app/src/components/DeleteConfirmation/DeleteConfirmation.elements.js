import styled from "styled-components";

export const Container = styled.div`
  border: 2px dashed;
  background-color: white;
  box-shadow: 10px 10px 37px 14px rgba(0, 0, 0, 0.11);
  -webkit-box-shadow: 10px 10px 37px 14px rgba(0, 0, 0, 0.11);
  -moz-box-shadow: 10px 10px 37px 14px rgba(0, 0, 0, 0.11);
  padding: 1rem;
  position: absolute;
  transform: translateY(1rem) translateX(-2rem);
  text-align: center;
  .modal-buttons {
    display: flex;
    > * {
      margin: .5rem;
    }
  }
`;
