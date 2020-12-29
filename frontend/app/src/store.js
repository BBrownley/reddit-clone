import postsReducer from "./reducers/postsReducer";
import groupsReducer from "./reducers/groupsReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const reducer = combineReducers({
  posts: postsReducer,
  groups: groupsReducer
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
