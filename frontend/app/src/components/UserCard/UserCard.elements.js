import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  border: 1px solid black;
  display: inline-block;
  padding: 0.5rem;
  display: inline-flex;
  margin-left: 1rem;
`;

export const ProfileImage = styled.img`
  height: 50px;
  margin-right: 1rem;
`;

export const InboxLink = styled(Link)`
  margin-right: 2rem;
  font-weight: bold;
  color: blue;
  position: relative;
  span {
    ${props => {
      return `background-color: ${props.theme.crimson};`;
    }}
    color: white;
    padding: 0 0.5rem;
    margin-left: 0.5rem;
    border-radius: 1000px;
    font-size: 12px;
  }
  &:hover {
    text-decoration: underline;
  }
`;
