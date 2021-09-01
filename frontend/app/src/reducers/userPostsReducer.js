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

export const clearUserPosts = () => {
  return async dispatch => {
    dispatch({type: "CLEAR_USER_POSTS"})
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_USER_POSTS":
      return action.posts;
    case "CLEAR_USER_POSTS":
      return initialState;
    default:
      return state;
  }
};

export default reducer;
