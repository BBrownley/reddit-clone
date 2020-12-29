import groupService from "../services/groups";

export const initializeGroups = () => {
  return async dispatch => {
    const data = await groupService.getAll();
    dispatch({
      type: "INITIALIZE_GROUPS",
      data
    });
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case "INITIALIZE_GROUPS":
      return action.data;
    default:
      return state;
  }
};

export default reducer;
