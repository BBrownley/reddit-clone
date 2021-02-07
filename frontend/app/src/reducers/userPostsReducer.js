export const logout = () => {
  return async dispatch => {
    dispatch({
      type: "LOGOUT"
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.data;
    case "LOGOUT":
      return null;
    case "SET_USER":
      return action.userInfo;
    case "ADD_POST":
      return {...state, userPosts: [...state.userPosts, action.postId]}
    default:
      return state;
  }
};

export default reducer;
