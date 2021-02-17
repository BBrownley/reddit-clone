const initialState = null;

export const setRedirectPath = path => {
  return async dispatch => {
    dispatch({
      type: "SET_PATH",
      path
    });
  };
};

export const clearRedirectPath = () => {
  return async dispatch => {
    dispatch({
      type: "CLEAR_PATH"
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PATH":
      return action.path;
    case "CLEAR_PATH":
      return null;
    default:
      return state;
  }
};

export default reducer;
