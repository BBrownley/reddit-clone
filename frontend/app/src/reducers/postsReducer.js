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

export const createPost = post => {
  return async dispatch => {
    const data = await postService.createPost(post);
    dispatch({
      type: "CREATE_POST",
      data
    });
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

    default:
      return state;
  }
};

export default reducer;
