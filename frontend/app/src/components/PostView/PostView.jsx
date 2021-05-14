import React, { useEffect } from "react";

import NotFound from "../NotFound/NotFound";

import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import { initializeVotes as initializeCommentVotes } from "../../reducers/commentVotesReducer";
import { initializeBookmarks } from "../../reducers/userBookmarksReducer";

import Comments from "../Comments/Comments";

import Post from "../Post/Post";

const PostView = () => {
  const posts = useSelector(state => {
    return state.posts;
  });
  const user = useSelector(state => state.user);

  const match = useRouteMatch("/groups/:group/:id");
  const post = match
    ? posts.find(post => post.postID.toString() === match.params.id.toString())
    : null;

  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      await dispatch(initializeBookmarks(match.params.id));
      await dispatch(initializeCommentVotes());
    };
    if (user.token !== null) init();
  }, [dispatch]);

  return (
    <>
      {!post && <NotFound />}
      {post && (
        <div>
          <Post post={post} key={post.postID} expand={true} viewMode={true} />
          <Comments
            postId={post.postID}
            authorId={post.user_id}
            postTitle={post.title}
          />
        </div>
      )}
    </>
  );
};

export default PostView;
