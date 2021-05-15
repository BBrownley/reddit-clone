import styled from "styled-components";
import redditto from "../../redditto.png";
import reddittoIcon from "../../brandingIcon.png";

export const Navigation = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  position: relative;
  ul {
    display: flex;
    width: 14rem;
    justify-content: space-between;
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
  h2 {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${props => props.theme.cornflowerBlue};
    color: white;
    padding: 0.5rem;
    .groups-link {
      color: white;
      &:hover {
        text-decoration: none;
      }
    }
  }
  @media (max-width: 1000px) {
    display: none;
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

export const HamburgerMenu = styled.div`
  border-bottom: 1px solid #ccc;
  background-color: white;
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  height: 5rem;
  display: none;

  @media (max-width: 1000px) {
    display: flex;
    align-items: center;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 2rem;
    width: 100%;
  }

  .branding-icon {
    background-image: url(${reddittoIcon});
    height: 3rem;
    width: 3rem;
    background-size: cover;
  }

  .fa-bars {
    font-size: 2.5rem;
  }
`;
