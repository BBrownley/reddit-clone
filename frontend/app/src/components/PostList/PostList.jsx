import React from "react";
import { Link, useRouteMatch } from "react-router-dom";

import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import {
  initializeVotes,
  addVote,
  removeVote
} from "../../reducers/userPostVotesReducer";
import { initializePosts } from "../../reducers/postsReducer";

import FontAwesome from "react-fontawesome";

import { Post, VoteContainer, Content, PostOptions } from "./PostList.elements";

import PostHeader from "../shared/PostHeader";

const PostList = ({ sortBy, searchBy, searchTerm }) => {
  const match = useRouteMatch("/groups/:group");
  const dispatch = useDispatch();

  const userPostVotes = useSelector(state => state.userPostVotes);

  let postsToDisplay = useSelector(state => {
    let posts = [];

    console.log(state);

    if (!match) {
      posts = state.posts;
    } else {
      posts = state.posts.filter(post => {
        // TODO: This line causes an unexpected error sometimes
        return post.groupName.toLowerCase() === match.params.group;
      });
    }

    // Map posts that user voted on to the post list
    userPostVotes.forEach(vote => {
      if (posts.filter(post => post.postID === vote.post_id)) {
        const votedPost = posts.indexOf(
          posts.find(post => post.postID === vote.post_id)
        );

        posts[votedPost] = { vote: vote.vote_value, ...posts[votedPost] };
      }
    });

    return posts;
  });

  console.log(postsToDisplay);

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
        return b.score - a.score;
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

  const handleUpvotePost = async postID => {
    console.log("upvoting post");

    await dispatch(addVote(postID, 1));

    dispatch(initializeVotes());
    dispatch(initializePosts());
  };

  const handleDownvotePost = async postID => {
    console.log("downvoting post");
    await dispatch(addVote(postID, -1));

    dispatch(initializeVotes());
    dispatch(initializePosts());
  };

  return postsToDisplay.map(post => (
    <Post key={post.postID}>
      <VoteContainer>
        <FontAwesome
          name="plus-square"
          className="upvote"
          onClick={() => handleUpvotePost(post.postID)}
          style={post.vote === 1 ? { color: "blue" } : {}} // Refactor this later
        />
        <span>{post.score}</span>
        <FontAwesome
          name="minus-square"
          className="downvote"
          onClick={() => handleDownvotePost(post.postID)}
          style={post.vote === -1 ? { color: "red" } : {}} // Refactor this later
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
