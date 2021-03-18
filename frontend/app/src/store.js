import postsReducer from "./reducers/postsReducer";
import groupsReducer from "./reducers/groupsReducer";
import userReducer from "./reducers/userReducer";
import userPostVotesReducer from "./reducers/userPostVotesReducer";
import userBookmarksReducer from "./reducers/userBookmarksReducer";
import commentVotesReducer from "./reducers/commentVotesReducer";
import notificationReducer from "./reducers/notificationReducer";
import groupSubscribesReducer from "./reducers/groupSubscribesReducer";
import redirectReducer from "./reducers/redirectReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const reducer = combineReducers({
  posts: postsReducer,
  groups: groupsReducer,
  user: userReducer,
  userPostVotes: userPostVotesReducer,
  userCommentVotes: commentVotesReducer,
  userBookmarks: userBookmarksReducer,
  notification: notificationReducer,
  subscribedGroups: groupSubscribesReducer,
  redirectPath: redirectReducer
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
