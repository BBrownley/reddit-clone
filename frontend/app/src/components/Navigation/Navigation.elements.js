import styled, { keyframes } from "styled-components";
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

const openAnimation = keyframes`
 0% {
  background-color: rgba(0, 0, 0, 0);
 }
 100% {
   background-color: rgba(0, 0, 0, 0.9);
 }
`;

export const HamburgerMenu = styled.div`
  position: fixed;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  display: none;

  .top {
    border-bottom: 1px solid #ccc;
    background-color: white;

    height: 5rem;
  }

  .mini-nav ul {
    display: flex;
    li {
      font-size: 1.25rem;
      margin-right: 2.5rem;
      @media (max-width: 425px) {
        font-size: 1rem;
      }
      @media (max-width: 375px) {
        font-size: 1.25rem;
        &:last-of-type {
          display: none;
        }
        &:nth-last-child(2) {
          margin-right: 0;
        }
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }

  @media (max-width: 1000px) {
    display: block;
    .top {
      display: flex;
      align-items: center;
    }
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

  .menu-bars {
    transform: translateX(0);
    transition: 0.25s;
    &:hover {
      cursor: pointer;
    }
    .bar {
      height: 0.25rem;
      width: 2rem;
      background-color: black;
      margin-bottom: 0.5rem;
      transition: 0.25s;
      &:last-of-type {
        margin-bottom: 0;
      }
      &:nth-of-type(1) {
        transform: rotate(0) translateY(0);
      }
      &:nth-of-type(2) {
        opacity: 1;
        width: 2rem;
      }
      &:nth-of-type(3) {
        margin-bottom: 0;
      }
    }
    &.open {
      transform: translateX(-0.75rem);
      transition: 0.25s;
      .bar {
        transition: 0.25s;
        &:nth-of-type(1) {
          transform: rotate(-45deg) translateY(1rem);
        }
        &:nth-of-type(2) {
          opacity: 0;
          width: 0;
        }
        &:nth-of-type(3) {
          transform: rotate(45deg) translateY(-1rem);
        }
      }
    }
  }

  .menu {
    text-align: center;
    padding: 1rem;
    display: none;
    user-select: none;
    a {
      color: white;
      font-size: 2rem;
    }
    &.open {
      background-color: rgba(0, 0, 0, 0.9);
      display: block;
      animation: ${openAnimation} 0.25s;
    }
  }

  @media (max-width: 1000px) {
    .menu {
      .open {
        display: block;
      }
    }
  }
`;
