import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 1rem;
  margin-bottom: 1rem;

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
    padding: 0.625rem 2rem;
  }
  @media (max-width: 800px) {
    .create-group-button {
      width: 100%;
    }
  }
`;

export const Wrapper = styled.div`
  margin-top: 3.25rem;
  @media (max-width: 1000px) {
    margin-top: 0;
  }
`;
