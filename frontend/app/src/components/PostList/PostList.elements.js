import styled, { css, keyframes } from "styled-components";

export const Container = styled.div``;

export const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 0 0.5rem;
  padding-left: 5px;
  line-height: 1.5;
  display: flex;

  width: 100%;
  padding-bottom: 1rem;
  margin-bottom: 1rem;

  > div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    > div {
      display: flex;
      width: 100%;
      align-items: flex-start;
    }
  }
  .comment-icon {
    margin-right: 5px;
  }
`;

export const PostMain = styled.span`
  .fa-history {
    color: #999;
  }
  a {
    color: #4385f5;
    &:hover {
      cursor: pointer;
      text-decoration: underline;
    }
  }
`;

export const Title = styled.div`
  color: #222;
  font-weight: bold;
  font-size: 1.5rem;
  display: inline-block;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const Content = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80ch;
  ${props => {
    if (props.expand) {
      return `
      border: 1px solid #777;
      background-color: #fafafa;
      padding: 10px;
      overflow: visible;
      white-space: normal;
      `;
    }
  }}
  @media (max-width: 900px) {
    max-width: 60ch;
  }
  @media (max-width: 720px) {
    max-width: 45ch;
  }
  @media (max-width: 560px) {
    ${props => {
      if (!props.expand) {
        return css`
          display: none;
        `;
      }
    }}
  }
`;

export const PostScore = styled.span`
  padding: 0 0;
  font-size: 1.5rem;
`;

export const CommentCountSm = styled.span`
  font-size: 1.5rem;
  color: #777777;
  display: inline-block;
  @media (min-width: 1041px) {
    display: none;
  }
`;

export const CommentCountLg = styled.span`
  font-size: 1.5rem;
  color: #777777;
  @media (max-width: 1040px) {
    display: none;
  }
`;

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  color: #777;
  font-size: 1.5rem;
`;

const upvoteAnim = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-.25rem);
  }
  100% {
    transform: translateY(0);
  }
`;

const downvoteAnim = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(.25rem);
  }
  100% {
    transform: translateY(0);
  }
`;

export const VoteButton = styled.span`
  &:hover {
    opacity: 0.75;
    cursor: pointer;
  }
  ${props => {
    if (props.upvoted) {
      return css`
        color: ${props.theme.cornflowerBlue};
        animation: 0.2s ${upvoteAnim} ease-out;
      `;
    } else if (props.downvoted) {
      return css`
        color: ${props.theme.crimson};
        animation: 0.2s ${downvoteAnim} ease-out;
      `;
    }
  }}
`;

export const PostOptions = styled.div`
  font-size: 0.875rem;
  color: #777;
  display: flex;

  align-items: center;
  justify-content: space-between;
  div:nth-child(1) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  .post-actions {
    display: flex;
    flex-wrap: wrap;
    font-weight: bold;
    font-size: 0.875rem;
    color: ${props => props.theme.cornflowerBlue};
    margin-left: -0.5rem;

    > * {
      margin-left: 1rem;
    }

    &:hover {
      cursor: pointer;
      text-decoration: bold;
    }
  }
`;
