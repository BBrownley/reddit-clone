import styled from "styled-components";

export const GroupInfo = styled.div`
  text-align: center;

  .group-desc {
    max-width: 80ch;
    margin: auto;
    margin-top: 10px;
  }

  .group-actions {
    display: flex;
    margin: 30px 0;
    background-color: green;

    justify-content: space-between;
    & > * {
      flex: 1;
      margin-right: 2rem;
    }
    & > *:last-child {
      margin-right: 0;
    }
  }
`;
