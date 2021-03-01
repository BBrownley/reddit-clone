import styled from "styled-components";

export const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  padding-left: 5px;
  line-height: 1.5;
  display: flex;
  &:hover {
    background-color: #f5f5f5;
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
`;

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 8px;
  align-items: center;
  margin-right: 20px;
  color: #777;
  font-size: 20px;
  .upvote:hover,
  .downvote:hover {
    cursor: pointer;
  }
  .upvote:hover {
    color: #4385f5;
  }
  .downvote:hover {
    color: #ff3548;
  }
`;

export const PostOptions = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 10px;
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
