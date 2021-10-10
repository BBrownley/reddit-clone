import userService from "../services/users";
import postService from "../services/posts";
import groupService from "../services/groups";
import userPostVoteService from "../services/userPostVotes";
import commentsService from "../services/comments";
import messageService from "../services/messages";
import commentVotesService from "../services/commentVotes";
import bookmarkService from "../services/bookmarks";
import userHistoryService from "../services/userHistory";

import { setNotification } from "../reducers/notificationReducer";
import { timedToast } from "../reducers/toastReducer";

const initialState = {
  username: null,
  token: null,
  userId: null,
  postFollows: [],
  commentVotes: []
};

export const register = credentials => {
  return async dispatch => {
    const data = await userService.register(credentials);

    if (data.error) {
      dispatch(setNotification(data.error));
      return false;
    } else {
      localStorage.setItem(
        "loggedUser",
        JSON.stringify({
          postFollows: [],
          token: data.token,
          userId: data.userId,
          userPosts: [],
          username: credentials.data.username
        })
      );
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
      dispatch(setNotification(res.error));
      return false;
    } else {
      const data = {
        username: res.username,
        token: res.token,
        userPosts: res.userPosts,
        userId: res.userId,
        postFollows: res.postFollows
      };

      dispatch(timedToast(res.toastMessage));

      postService.setToken(data.token);
      userPostVoteService.setToken(data.token);
      groupService.setToken(data.token);
      commentsService.setToken(data.token);
      messageService.setToken(data.token);
      commentVotesService.setToken(data.token);
      bookmarkService.setToken(data.token);
      userHistoryService.setToken(data.token);

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
    postService.setToken(null);
    userPostVoteService.setToken(null);
    groupService.setToken(null);
    commentsService.setToken(null);
    messageService.setToken(null);
    commentVotesService.setToken(null);
    bookmarkService.setToken(null);
    userHistoryService.setToken(null);

    dispatch({
      type: "LOGOUT"
    });
    dispatch(timedToast("Logged out"));
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
    bookmarkService.setToken(userInfo.token);
    userHistoryService.setToken(userInfo.token);

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
      postId: post.post_id
    });
  };
};

export const followPost = postId => {
  return async dispatch => {
    await postService.followPost(postId);
    dispatch({
      type: "FOLLOW_POST",
      postId
    });
  };
};

export const unfollowPost = postId => {
  return async dispatch => {
    await postService.unfollowPost(postId);
    dispatch({
      type: "UNFOLLOW_POST",
      postId
    });
  };
};

export const initializeFollows = () => {
  return async dispatch => {
    const res = await postService.getPostFollows();
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
      return initialState;
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
