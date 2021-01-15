import postsReducer from "./reducers/postsReducer";
import groupsReducer from "./reducers/groupsReducer";
import userReducer from "./reducers/userReducer";
import userPostVotesReducer from "./reducers/userPostVotesReducer";
import notificationReducer from "./reducers/notificationReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const reducer = combineReducers({
  posts: postsReducer,
  groups: groupsReducer,
  user: userReducer,
  userPostVotes: userPostVotesReducer,
  notification: notificationReducer
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
