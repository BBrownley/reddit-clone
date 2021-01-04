import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import moment from "moment";

import { upvote, downvote } from "../../reducers/postsReducer";

import FontAwesome from "react-fontawesome";

import {
  Post,
  VoteContainer,
  PostMain,
  Title,
  Content,
  PostOptions,
  FollowButton
} from "./PostView.elements";

import PostHeader from "../shared/PostHeader";

const PostView = () => {
  const posts = useSelector(state => state.posts);
  const dispatch = useDispatch();

  const match = useRouteMatch("/groups/:group/:id");
  const post = match
    ? posts.find(post => post.postID.toString() === match.params.id.toString())
    : null;

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
          <FollowButton>
            <FontAwesome name="heart" className="fa-heart" /> Follow
          </FollowButton>
        </PostOptions>
      </div>
    </Post>
  );
};

export default PostView;
