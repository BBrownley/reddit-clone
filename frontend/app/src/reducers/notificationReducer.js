const initialState = "";

export const setNotification = msg => {
  return async dispatch => {
    dispatch({
      type: "SET_NOTIFICATION",
      msg
    });
  };
};

export const removeNotification = () => {
  return async dispatch => {
    dispatch({
      type: "REMOVE_NOTIFICATION"
    });
  };
};

export const timedNotification = (msg, ms) => {
  return async dispatch => {
    dispatch({
      type: "SET_NOTIFICATION",
      msg
    });
    setTimeout(() => {
      dispatch({
        type: "REMOVE_NOTIFICATION"
      });
    }, ms);
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.msg;
    case "REMOVE_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

export default reducer;
