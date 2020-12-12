import postService from "../services/posts";
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_POSTS":
      return action.data;
    default:
      return state;
  }
};

export default reducer;
