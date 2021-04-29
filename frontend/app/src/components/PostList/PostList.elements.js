import styled, { css } from "styled-components";

export const Container = styled.div`
 
`

export const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  padding-left: 5px;
  line-height: 1.5;
  display: flex;
  width: 100%;

  & > div {
    display: flex;
    width: 100%;
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
      word-break: break-all;
      `;
    }
  }}
  @media (max-width: 900px) {
    max-width: 60ch;
  })
  @media (max-width: 720px) {
    max-width: 45ch;
  })
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
  font-size: .875rem;
  color: #777;
  display: flex;
  align-items: center;
  justify-content: space-between;
  div:nth-child(1) {
    display: flex;
    align-items: center;
  }
`;
