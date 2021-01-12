import userPostVotesService from "../services/userPostVotes";
import postService from "../services/posts";

export const initializeVotes = () => {
  return async dispatch => {
    const data = await userPostVotesService.getUserPostVotes();
    dispatch({
      type: "INITIALIZE_VOTES",
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
        id
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

const reducer = (state = [], action) => {
  switch (action.type) {
    case "INITIALIZE_VOTES":
      return action.data;
    case "ADD_VOTE":
      return [...state, action.data];
    case "REMOVE_VOTE":
      return state.filter(vote => {
        return vote.id !== action.data.id;
      });
    default:
      return state;
  }
};

export default reducer;
