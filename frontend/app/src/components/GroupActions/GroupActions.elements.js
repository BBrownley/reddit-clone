import styled from "styled-components";

export const GroupActions = styled.div`
  display: flex;
  margin: 30px 0;

  justify-content: space-between;
  & > * {
    flex: 1;
    margin-right: 2rem;
  }
  & > *:last-child {
    margin-right: 0;
  }
`;
