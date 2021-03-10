import userService from "../services/users";
import postService from "../services/posts";
import groupService from "../services/groups";
import userPostVoteService from "../services/userPostVotes";
import commentsService from "../services/comments";
import messageService from "../services/messages";
import commentVotesService from "../services/commentVotes";

import { timedNotification } from "../reducers/notificationReducer";

const initialState = {
  username: null,
  token: null,
  postFollows: [],
  commentVotes: []
};

export const register = credentials => {
  return async dispatch => {
    const data = await userService.register(credentials);

    if (data.error) {
      dispatch(timedNotification(data.error, 3000));
      return false;
    } else {
      dispatch({
        type: "LOGIN",
        data
      });
      return true;
    }
  };
};

export const login = (credentials, hasToken) => {
  return async dispatch => {
    const res = await userService.login(credentials);

    if (res.error) {
      dispatch(timedNotification(res.error, 3000));
      return false;
    } else {
      const data = {
        username: res.username,
        token: res.token,
        userPosts: res.userPosts,
        userId: res.userId,
        postFollows: res.postFollows
      };

      postService.setToken(data.token);
      userPostVoteService.setToken(data.token);
      groupService.setToken(data.token);
      commentsService.setToken(data.token);
      messageService.setToken(data.token);
      commentVotesService.setToken(data.token);

      dispatch({
        type: "LOGIN",
        data
      });
      return data;
    }
  };
};

export const logout = () => {
  return async dispatch => {
    dispatch({
      type: "LOGOUT"
    });
  };
};

export const setUser = userInfo => {
  return async dispatch => {
    postService.setToken(userInfo.token);
    userPostVoteService.setToken(userInfo.token);
    groupService.setToken(userInfo.token);
    commentsService.setToken(userInfo.token);
    messageService.setToken(userInfo.token);
    commentVotesService.setToken(userInfo.token);
    dispatch({
      type: "SET_USER",
      userInfo
    });
  };
};

export const addPostToUser = post => {
  return async dispatch => {
    dispatch({
      type: "ADD_POST",
      postId: post.postID
    });
  };
};

export const followPost = postId => {
  return async dispatch => {
    const res = await postService.followPost(postId);
    console.log(res);
    dispatch({
      type: "FOLLOW_POST",
      postId: res.post_id
    });
  };
};

export const unfollowPost = postId => {
  return async dispatch => {
    const res = await postService.unfollowPost(postId);
    dispatch({
      type: "UNFOLLOW_POST",
      postId: res.postId
    });
  };
};

export const initializeFollows = () => {
  return async dispatch => {
    const res = await postService.getPostFollows();
    console.log(res);
    dispatch({
      type: "INITIALIZE_FOLLOWS",
      postFollows: res.posts
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.data;
    case "LOGOUT":
      return null;
    case "SET_USER":
      return action.userInfo;
    case "ADD_POST":
      return { ...state, userPosts: [...state.userPosts, action.postId] };
    case "FOLLOW_POST":
      return { ...state, postFollows: [...state.postFollows, action.postId] };
    case "UNFOLLOW_POST":
      return {
        ...state,
        postFollows: state.postFollows.filter(id => id !== action.postId)
      };
    case "INITIALIZE_FOLLOWS":
      return { ...state, postFollows: action.postFollows };
    default:
      return state;
  }
};

export default reducer;
