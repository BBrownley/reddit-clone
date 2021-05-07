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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_USER_POSTS":
      return action.posts;
    default:
      return state;
  }
};

export default reducer;
