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
    await postService.vote(id, vote_value);

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
        return vote.id !== action.data.id;
      });
    case "CLEAR_POST_VOTES":
      return [];
    default:
      return state;
  }
};

export default reducer;
