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
      type: "COMMENT_VOTE",
      newVote
    });
  };
};

export const removeVote = commentId => {
  return async dispatch => {
    await commentVotesService.removeVote(commentId);
    dispatch({
      type: "REMOVE_COMMENT_VOTE",
      commentId
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_COMMENT_VOTES":
      return action.votes;
    case "COMMENT_VOTE":
      return [...state, action.newVote];
    case "REMOVE_COMMENT_VOTE":
      return [...state.filter(vote => vote.comment_id !== action.commentId)];
    default:
      return state;
  }
};

export default reducer;
