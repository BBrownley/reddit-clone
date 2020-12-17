import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import { upvote, downvote } from "../reducers/postsReducer";

import styled from "styled-components";
import FontAwesome from "react-fontawesome";

const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  line-height: 1.5;
  display: flex;
`;

const PostMain = styled.div`
  margin-bottom: 15px;
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

const Title = styled.div`
  color: #222;
  font-weight: bold;
  font-size: 1.5rem;
  display: inline-block;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Content = styled.div`
  max-width: 80ch;
  border: 1px solid #777;
  /* border-radius: 5px; */
  background-color: #fafafa;
  padding: 10px;
`;

const VoteContainer = styled.div`
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

const PostOptions = styled.div`
  color: #777;
  margin-top: 10px;
  & > span {
    margin-right: 10px;
    padding: 4px;
    border-radius: 5px;
  }
  .favorite-active {
    background-color: #eee;
    color: #333;
    font-weight: bold;
    .fa-heart {
      color: #fc74a4;
    }
  }
`;

const FollowButton = styled.span`
  border: 1px solid #fc74a4;
  .fa-heart {
    color: #fc74a4;
  }
`;

const PostView = () => {
  const posts = useSelector(state => state.posts);
  const dispatch = useDispatch();

  const match = useRouteMatch("/groups/:group/:id");
  const post = match
    ? posts.find(post => post.id.toString() === match.params.id.toString())
    : null;

  console.log(posts.find(post => post.id === match.params.id));

  if (!post) {
    return null;
  }

  const handleUpvotePost = post => {
    dispatch(upvote(post));
  };

  const handleDownvotePost = post => {
    dispatch(downvote(post));
  };

  return (
    <Post>
      <VoteContainer>
        <FontAwesome
          name="plus-square"
          className="upvote"
          onClick={() => handleUpvotePost(post)}
        />
        <span>{post.votes <= 0 ? 0 : post.votes}</span>
        <FontAwesome
          name="minus-square"
          className="downvote"
          onClick={() => handleDownvotePost(post)}
        />
      </VoteContainer>
      <div>
        <PostMain>
          <Link to={`/groups/${post.group}/${post.id}`}>
            <Title>{post.title}</Title>{" "}
          </Link>
          <div>
            posted <FontAwesome name="history" className="fa-history" /> 10
            hours ago in{" "}
            <a href="#">
              <Link to={`/groups/${post.group}`}>
                <strong>{post.group}</strong>
              </Link>
            </a>{" "}
            by{" "}
            <a href="#">
              <strong>{post.author}</strong>
            </a>
          </div>
        </PostMain>

        <Content>{post.content}</Content>
        <PostOptions>
          <span>
            <FontAwesome name="comments" /> {post.comments.length} comments
          </span>
          <FollowButton>
            <FontAwesome name="heart" className="fa-heart" /> Follow
          </FollowButton>
        </PostOptions>
      </div>
    </Post>
  );
};

export default PostView;
