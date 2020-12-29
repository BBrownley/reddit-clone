import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { upvote, downvote } from "../reducers/postsReducer";

import FontAwesome from "react-fontawesome";

const Post = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px;
  padding-left: 5px;
  line-height: 1.5;
  display: flex;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PostMain = styled.span`
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
  font-size: 24px;
  display: inline-block;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Content = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80ch;
`;

const VoteContainer = styled.div`
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

const PostOptions = styled.div`
  font-size: 14px;
  color: #777;
  margin-top: 10px;
  & > span {
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
  }
`;

const PostList = ({ sortBy, searchBy, searchTerm }) => {
  const match = useRouteMatch("/groups/:group");
  const dispatch = useDispatch();

  let postsToDisplay = useSelector(state => {
    if (match.params.group === "all") {
      return state.posts;
    } else {
      return state.posts.filter(post => {
        return post.group === match.params.group;
      });
    }
  });

  // Filter results if search is used
  if (!!searchTerm) {
    postsToDisplay = postsToDisplay.filter(post => {
      if (searchBy === "title") {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === "content") {
        return post.content.toLowerCase().includes(searchTerm.toLowerCase());
      }
    });
  }

  postsToDisplay = postsToDisplay.sort((a, b) => {
    switch (sortBy) {
      case "new":
        const timestampA = moment(a.createdAt);
        const timestampB = moment(b.createdAt);

        return timestampA.isAfter(timestampB) ? -1 : 1;
      case "top":
        return b.votes - a.votes;
      case "followers":
        return b.followers - a.followers;

      // case "commentsAsc":
      //   return a.comments.length - b.comments.length;
      // case "commentsDesc":
      //   return b.comments.length - a.comments.length;
      default:
        return null;
    }
  });

  const handleUpvotePost = post => {
    dispatch(upvote(post));
  };

  const handleDownvotePost = post => {
    dispatch(downvote(post));
  };

  return postsToDisplay.map(post => (
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
          posted <FontAwesome name="history" className="fa-history" />{" "}
          {moment(post.createdAt).fromNow()} in{" "}
          <a href="#">
            <Link to={`/groups/${post.group_id}`}>
              <strong>{post.groupName}</strong>
            </Link>
          </a>{" "}
          by{" "}
          <a href="#">
            <strong>{post.username}</strong>
          </a>
        </PostMain>

        <Content>{post.content}</Content>
        <PostOptions>
          <span>
            {/* <FontAwesome name="comments" /> {post.comments.length} comments */}
          </span>
          <span className={Math.random() > 0.5 ? "favorite-active" : ""}>
            <FontAwesome name="heart" className="fa-heart" /> {post.followers}{" "}
            followers
          </span>
        </PostOptions>
      </div>
    </Post>
  ));
};

export default PostList;
