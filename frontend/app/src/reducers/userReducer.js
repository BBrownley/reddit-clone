import userService from "../services/users";
import postService from "../services/posts";
import userPostVoteService from "../services/userPostVotes";

import { timedNotification } from "../reducers/notificationReducer";

const initialState = null;

export const register = credentials => {
  return async dispatch => {
    const data = await userService.register(credentials);
    console.log(data);

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

export const login = credentials => {
  return async dispatch => {
    const data = await userService.login(credentials);
    console.log(data);

    if (data.error) {
      dispatch(timedNotification(data.error, 3000));
      return false;
    } else {
      postService.setToken(data.token);
      userPostVoteService.setToken(data.token);
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.data;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export default reducer;
