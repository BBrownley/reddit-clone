import styled from "styled-components";

export const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  line-height: 1.5;
  display: flex;
`;

export const PostMain = styled.div`
  margin-bottom: 1rem;
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
  max-width: 80ch;
  border: 1px solid #777;
  /* border-radius: 5px; */
  background-color: #fafafa;
  padding: 10px;
`;

export const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  align-items: center;
  margin-right: 20px;
  color: #777;
  font-size: 1.25rem;
  .upvote {
    color: saturate(blue, 30%);
  }
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
  & > * {
    margin-bottom: 5.7px;
  }
`;

// export const PostOptions = styled.div`
//   color: #777;
//   margin-top: 10px;
//   & > span {
//     margin-right: 10px;
//     padding: 4px;
//     border-radius: 5px;
//   }
//   .favorite-active {
//     background-color: #eee;
//     color: #333;
//     font-weight: bold;
//     .fa-heart {
//       color: #fc74a4;
//     }
//   }
// `;

export const FollowButton = styled.span`
  border: 1px solid #fc74a4;
  .fa-heart {
    color: #fc74a4;
  }
`;
