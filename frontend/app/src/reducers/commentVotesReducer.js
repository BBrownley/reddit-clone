import commentVotesService from "../services/commentVotes";

const initialState = [];

export const initializeVotes = () => {
  return async dispatch => {
    const votes = await commentVotesService.getVotes();
    dispatch({
      type: "INITIALIZE_COMMENT_VOTES",
      votes
    });
  };
};

export const vote = commentId => {
  return async dispatch => {
    const newVote = commentVotesService.vote(commentId);
    dispatch({
      type: "VOTE",
      newVote
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_COMMENT_VOTES":
      return action.votes;
    case "VOTE":
      return [...state, action.newVote];
    default:
      return state;
  }
};

export default reducer;
