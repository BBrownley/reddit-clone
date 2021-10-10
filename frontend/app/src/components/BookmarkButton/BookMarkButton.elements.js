import styled from "styled-components";

export const Container = styled.li`
  span {
    display: flex;
    align-items: center;
    .fa-bookmark {
      margin-right: 0.5rem;
    }
  }
  &.active {
    background-color: ${props => props.theme.cornflowerBlue};
    color: white;
    padding: 0 0.5rem;
  }
`;
