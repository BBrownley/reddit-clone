import userPostVotesService from "../services/userPostVotes";
import postService from "../services/posts";

export const initializeVotes = () => {
  return async dispatch => {
    const data = await userPostVotesService.getUserPostVotes();

    dispatch({
      type: "INITIALIZE_POST_VOTES",
      data
    });
  };
};

export const addVote = (id, vote_value) => {
  return async dispatch => {
    dispatch({
      type: "ADD_VOTE",
      data: {
        id,
        vote_value
      }
    });
  };
};

export const removeVote = id => {
  return async dispatch => {
    dispatch({
      type: "REMOVE_VOTE",
      data: {
        id
      }
    });
  };
};

export const switchVote = (postId, newValue) => {
  return async dispatch => {
    dispatch({
      type: "SWITCH_VOTE",
      data: {
        postId,
        newValue
      }
    });
  };
};

export const clearVotes = () => {
  return async dispatch => {
    dispatch({
      type: "CLEAR_POST_VOTES"
    });
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case "INITIALIZE_POST_VOTES":
      return action.data;
    case "ADD_VOTE":
      return [
        ...state,
        { post_id: action.data.id, vote_value: action.data.vote_value }
      ];
    case "REMOVE_VOTE":
      return state.filter(vote => {
        return vote.post_id !== action.data.id;
      });
    case "SWITCH_VOTE":
      return state.map(vote => {
        if (vote.post_id === action.data.postId) {
          return { ...vote, vote_value: vote.vote_value * -1 };
        }
        return vote;
      });
    case "CLEAR_POST_VOTES":
      return [];
    default:
      return state;
  }
};

export default reducer;
