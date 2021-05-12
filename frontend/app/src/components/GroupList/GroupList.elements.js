import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;

  @media (max-width: 1075px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 568px) {
    grid-template-columns: 1fr;
  }
`;

export const GroupListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  .fa-users {
    margin-right: 1rem;
  }
  .create-group-button {
    width: 500px;
  }
`;
