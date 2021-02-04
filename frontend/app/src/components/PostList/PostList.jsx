import React from "react";
import { useRouteMatch } from "react-router-dom";

import moment from "moment";

import { useSelector } from "react-redux";

import Post from "../Post/Post";

const PostList = ({ sortBy, searchBy, searchTerm }) => {
  const match = useRouteMatch("/groups/:group");

  const userPostVotes = useSelector(state => state.userPostVotes);

  let postsToDisplay = useSelector(state => {
    let posts = [];

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

  // Filter results if search is used
  if (!!searchTerm) {
    postsToDisplay = postsToDisplay.filter(post => {
      if (searchBy === "title") {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === "content") {
        return post.content.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return post;
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

  return postsToDisplay.map(post => <Post post={post} key={post.postID} />);
};

export default PostList;
