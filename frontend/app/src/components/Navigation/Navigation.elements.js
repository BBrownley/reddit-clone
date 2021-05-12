import styled from "styled-components";
import redditto from "../../redditto.png";

export const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ul {
    display: flex;
    li {
      margin: 10px 20px;
      font-weight: bold;
      font-size: 1.25rem;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
  > div {
    display: flex;
    align-items: center;
    > *:not(:last-child) {
      margin-right: 2rem;
    }
  }
`;

export const Branding = styled.div`
  margin: 0;
  padding: 10px 0;
  background-image: url(${redditto});
  background-size: contain;
  background-repeat: no-repeat;
  height: 4rem;
  width: 14rem;
`;
