import postService from "../services/posts";

const initialState = [];

export const initializeUserPosts = userId => {
  return async dispatch => {
    const posts = await postService.getUserPosts(userId);

    dispatch({
      type: "INITIALIZE_USER_POSTS",
      posts
    });
  };
};

export const addUserPost = post => {
  return async dispatch => {
    dispatch({ type: "ADD_USER_POST", userPostId: post.post_id });
  };
};

export const clearUserPosts = () => {
  return async dispatch => {
    dispatch({ type: "CLEAR_USER_POSTS" });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_USER_POSTS":
      return action.posts;
    case "ADD_USER_POST":
      return [...state, action.userPostId];
    case "CLEAR_USER_POSTS":
      return initialState;
    default:
      return state;
  }
};

export default reducer;
