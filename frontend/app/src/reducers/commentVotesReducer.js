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

export const vote = (commentId, value) => {
  return async dispatch => {
    const newVote = await commentVotesService.vote(commentId, value);
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

export const changeVote = (commentId, newValue) => {
  return async dispatch => {
    const updatedVote = await commentVotesService.changeVote(
      commentId,
      newValue
    );
    console.log(updatedVote);
    dispatch({
      type: "UPDATE_COMMENT_VOTE",
      updatedVote
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_COMMENT_VOTES":
      return action.votes;
    case "COMMENT_VOTE":
      return [...state, action.newVote];
    case "UPDATE_COMMENT_VOTE":
      return state.map(vote => {
        if (vote.comment_id === action.updatedVote.comment_id) {
          return action.updatedVote;
        } else {
          return vote;
        }
      });
    case "REMOVE_COMMENT_VOTE":
      return [...state.filter(vote => vote.comment_id !== action.commentId)];
    default:
      return state;
  }
};

export default reducer;
