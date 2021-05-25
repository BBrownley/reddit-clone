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

export const vote = (commentId, value, postId) => {
  return dispatch => {
    const newVote = {
      comment_id: commentId,
      vote_value: value,
      post_id: postId
    };
    dispatch({
      type: "COMMENT_VOTE",
      newVote
    });
  };
};

export const removeVote = commentId => {
  return dispatch => {
    dispatch({
      type: "REMOVE_COMMENT_VOTE",
      commentId
    });
  };
};

export const changeVote = (commentId, newValue, postId) => {
  return async dispatch => {
    const updatedVote = {
      comment_id: commentId,
      vote_value: newValue,
      post_id: postId
    };
    dispatch({
      type: "UPDATE_COMMENT_VOTE",
      updatedVote
    });
  };
};

export const clearVotes = () => {
  return async dispatch => {
    dispatch({
      type: "CLEAR_COMMENT_VOTES"
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
    case "CLEAR_COMMENT_VOTES":
      return [];
    default:
      return state;
  }
};

export default reducer;
