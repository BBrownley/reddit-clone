import userService from "../services/users";
import postService from "../services/posts";
import userPostVoteService from "../services/userPostVotes";

const initialState = null;

export const login = credentials => {
  return async dispatch => {
    const data = await userService.login(credentials);
    postService.setToken(data.token);
    userPostVoteService.setToken(data.token);
    dispatch({
      type: "LOGIN",
      data
    });
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
