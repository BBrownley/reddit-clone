import React, { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";

import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import {
  initializeVotes,
  addVote,
  removeVote
} from "../../reducers/userPostVotesReducer";
import { initializePosts, removePost } from "../../reducers/postsReducer";

import postService from "../../services/posts";

import Post from "../Post/Post";

const PostList = ({ sortBy, searchBy, searchTerm }) => {
  const match = useRouteMatch("/groups/:group");
  const dispatch = useDispatch();

  // User post IDs by the logged in user
  const [userPosts, setUserPosts] = useState([]);

  const user = useSelector(state => state.user);
  const userPostVotes = useSelector(state => state.userPostVotes);

  useEffect(() => {
     
    const fetchUserPosts = async user => {
       
      const data = await postService.getByUser(user);
       
      setUserPosts(data);
    };
    if (user) {
      fetchUserPosts(user);
    }
  }, []);

  const clearUserPosts = () => {
    setUserPosts([]);
  };

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

  return postsToDisplay.map(post => <Post post={post} />);
};

export default PostList;
