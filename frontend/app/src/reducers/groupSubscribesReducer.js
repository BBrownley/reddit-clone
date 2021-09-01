import groupService from "../services/groups";

const initialState = [];

export const initializeSubscriptions = () => {
  return async dispatch => {
    const groups = await groupService.getUserSubscriptions();
    dispatch({
      type: "INITIALIZE_SUBSCRIPTIONS",
      groups
    });
  };
};

export const subscribeToGroup = (group, userId) => {
  return async dispatch => {
    await groupService.subscribeToGroup(group);
    dispatch({
      type: "SUBSCRIBE",
      group
    });
  };
};

export const unsubscribeFromGroup = (group, userId) => {
  return async dispatch => {
    await groupService.unsubscribe(group);
    dispatch({
      type: "UNSUBSCRIBE",
      group
    });
  };
};

export const clearSubscriptions = () => {
  return async dispatch => {
    dispatch({type: "CLEAR_SUBSCRIPTIONS"})
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_SUBSCRIPTIONS":
      return action.groups;
    case "SUBSCRIBE":
      return [...state, action.group];
    case "UNSUBSCRIBE":
      return state.filter(group => group.id !== action.group.id);
    case "CLEAR_SUBSCRIPTIONS":
      return initialState;
    default:
      return state;
  }
};

export default reducer;
