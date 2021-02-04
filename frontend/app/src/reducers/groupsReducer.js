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

export const createGroup = formData => {
  return async dispatch => {
    const data = await groupService.create(formData);
     
    if (data.error) {
       
      return false;
    } else {
      dispatch({
        type: "CREATE_GROUP",
        data
      });
      return data;
    }
  };
};

const reducer = (state = [], action) => {
  switch (action.type) {
    case "INITIALIZE_GROUPS":
      return action.data;
    case "CREATE_GROUP":
      return [...state, action.data];
    default:
      return state;
  }
};

export default reducer;
