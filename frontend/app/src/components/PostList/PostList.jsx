import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import { useSelector, useDispatch } from "react-redux";

import { initializePosts, removePost } from "../../reducers/postsReducer";

import Post from "../Post/Post";

import postListHelpers from "./helpers";

const PostList = ({ sortBy, searchBy, searchTerm, posts = undefined }) => {
  const match = useRouteMatch("/groups/:group");

  const userPostVotes = useSelector(state => state.userPostVotes);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializePosts());
  }, [posts]);

  let postsToDisplay = useSelector(state => {
    let posts = [];

    if (!match) {
      posts = state.posts;
    } else {
      posts = state.posts.filter(post => {
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

  postsToDisplay = postListHelpers.sortPosts(
    postListHelpers.filterPosts(postsToDisplay)
  );

  // Infinite scrolling setup

  const initialNumItems = 20;
  const increment = 20;

  const [index, setIndex] = useState(initialNumItems);
  const [postsToRender, setPostsToRender] = useState(
    postsToDisplay.slice(0, index)
  );
  const allPosts = postsToDisplay;

  const continueScroll = () => {
    const next = allPosts.slice(index, index + increment);

    if (index + increment > allPosts.length) {
      setIndex(prevIndex => prevIndex + (allPosts.length - prevIndex));
    } else {
      setIndex(prevIndex => prevIndex + increment);
    }

    setPostsToRender(prevState => [...prevState, ...next]);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={postsToRender.length}
        next={continueScroll}
        hasMore={true}
        scrollThreshold={0.95}
      >
        {postsToRender.map(post => (
          <Post post={post} key={post.postID} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default PostList;
