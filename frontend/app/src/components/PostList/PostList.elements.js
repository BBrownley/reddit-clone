import styled, { css } from "styled-components";

export const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  padding-left: 5px;
  line-height: 1.5;
  display: flex;
  width: 100%;
  &:hover {
    ${props => {
      if (props.expand !== true) {
        return `background-color: #f5f5f5;`;
      }
    }}
  }
  & > div {
    display: flex;
    width: 100%;
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
  font-size: 24px;
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
      word-break: break-all;
      `;
    }
  }}
`;

export const PostScore = styled.span`
  padding: 0 0;
  font-size: 1.5rem;
`;

export const CommentCount = styled.span`
  font-size: 24px;
  color: #777777;
`;

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  color: #777;
  font-size: 25px;
  /* position: relative;

  .upvote,
  .downvote {
    position: absolute;
  }

  .upvote {
    margin-bottom: 20px;
  }

  .downvote {
    margin-top: 20px;
  } */
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
      `;
    } else if (props.downvoted) {
      return css`
        color: ${props.theme.crimson};
      `;
    }
  }}
`;

export const PostOptions = styled.div`
  font-size: 14px;
  color: #777;
  display: flex;
  align-items: center;
  /* & > span {
    margin-right: 10px;
    padding: 4px;
    border-radius: 5px;
    &:hover {
      background-color: #eee;
      cursor: pointer;
    }
  }
  .favorite-active {
    background-color: #eee;
    color: #333;
    font-weight: bold;
    .fa-heart {
      color: #fc74a4;
    }
  } */
`;
