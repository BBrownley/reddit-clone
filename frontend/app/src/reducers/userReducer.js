import userService from "../services/users";
import postService from "../services/posts";
import groupService from "../services/groups";
import userPostVoteService from "../services/userPostVotes";
import commentsService from "../services/comments";
import messageService from "../services/messages";

import { timedNotification } from "../reducers/notificationReducer";

const initialState = { username: null, token: null };

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
        userPosts: res.userPosts
      };

      postService.setToken(data.token);
      userPostVoteService.setToken(data.token);
      groupService.setToken(data.token);
      commentsService.setToken(data.token);
      messageService.setToken(data.token);

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
    default:
      return state;
  }
};

export default reducer;
