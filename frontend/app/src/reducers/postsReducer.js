import postService from "../services/posts";

import { setNotification } from "../reducers/notificationReducer";
import {timedToast} from "../reducers/toastReducer"

const initialState = [];

export const initializePosts = () => {
  return async dispatch => {
    const data = await postService.getAll();
    dispatch({
      type: "INITIALIZE_POSTS",
      data
    });
  };
};

export const createPost = formData => {
  return async dispatch => {
    const data = await postService.createPost(formData);

    if (data.error) {
      dispatch(setNotification(data.error));
      return false;
    } else {
      dispatch({
        type: "CREATE_POST",
        data
      });
      dispatch(timedToast(data.toastMessage));
      return data;
    }
  };
};

export const upvote = upvotedPost => {
  return async dispatch => {
    const updatedPost = await postService.upvote(upvotedPost);
    dispatch({
      type: "UPVOTE_POST",
      upvotedPost,
      updatedPost
    });
  };
};

export const downvote = downvotedPost => {
  return async dispatch => {
    const updatedPost = await postService.downvote(downvotedPost);
    dispatch({
      type: "DOWNVOTE_POST",
      downvotedPost,
      updatedPost
    });
  };
};

export const removePost = postId => {
  return async dispatch => {
    postService.removePost(postId);
    dispatch({
      type: "REMOVE_POST",
      postId
    });
  };
};

export const editPost = (postId, newValue) => {
  return async dispatch => {
    postService.editPost(postId, newValue);
    dispatch({
      type: "EDIT_POST",
      postId,
      newValue
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_POSTS":
      return action.data;
    case "CREATE_POST":
      return state.concat(action.data);
    case "UPVOTE_POST":
      return state.map(post => {
        if (post.id !== action.upvotedPost.id) {
          return post;
        } else {
          return action.updatedPost;
        }
      });
    case "DOWNVOTE_POST":
      return state.map(post => {
        if (post.id !== action.downvotedPost.id) {
          return post;
        } else {
          return action.updatedPost;
        }
      });
    case "EDIT_POST":
      return state.map(post => {
        if (post.postID !== action.postId) {
          return post;
        } else {
          return { ...post, content: action.newValue };
        }
      });
    case "REMOVE_POST":
      return state.filter(post => post.postID !== action.postId);
    default:
      return state;
  }
};

export default reducer;
