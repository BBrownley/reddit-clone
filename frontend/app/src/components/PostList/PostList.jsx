import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { upvote, downvote } from "../../reducers/postsReducer";

import FontAwesome from "react-fontawesome";

import { Post, VoteContainer, Content, PostOptions } from "./PostList.elements";

import PostHeader from "../shared/PostHeader";

const PostList = ({ sortBy, searchBy, searchTerm }) => {
  const match = useRouteMatch("/groups/:group");
  const dispatch = useDispatch();

  let postsToDisplay = useSelector(state => {
    console.log(state);
    if (!match) {
      return state.posts;
    } else {
      return state.posts.filter(post => {
        return post.groupName.toLowerCase() === match.params.group;
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
    <Post key={post.postID}>
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
        <PostHeader
          postLink={`/groups/${post.groupName.toLowerCase()}/${post.postID}`}
          title={post.title}
          postAge={moment(post.createdAt).fromNow()}
          groupLink={`/groups/${post.groupName.toLowerCase()}`}
          groupName={post.groupName}
          author={post.username}
        />

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
