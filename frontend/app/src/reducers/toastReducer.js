const initialState = null;

export const timedToast = message => {
  return async dispatch => {
    dispatch({
      type: "SET_TOAST",
      message
    });
    setTimeout(() => {
      dispatch({
        type: "REMOVE_TOAST"
      });
    }, 5000);
  };
};

export const removeToast = () => {
  return dispatch => {
    dispatch({
      type: "REMOVE_TOAST"
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOAST":
      return action.message;
    case "REMOVE_TOAST":
      return null;
    default:
      return state;
  }
};

export default reducer;
