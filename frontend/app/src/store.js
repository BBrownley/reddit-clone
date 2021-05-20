import postsReducer from "./reducers/postsReducer";
import groupsReducer from "./reducers/groupsReducer";
import userReducer from "./reducers/userReducer";
import userPostsReducer from "./reducers/userPostsReducer";
import userPostVotesReducer from "./reducers/userPostVotesReducer";
import userBookmarksReducer from "./reducers/userBookmarksReducer";
import commentVotesReducer from "./reducers/commentVotesReducer";
import notificationReducer from "./reducers/notificationReducer";
import groupSubscribesReducer from "./reducers/groupSubscribesReducer";
import redirectReducer from "./reducers/redirectReducer";
import toastReducer from "./reducers/toastReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const reducer = combineReducers({
  user: userReducer,
  userPosts: userPostsReducer,
  userPostVotes: userPostVotesReducer,
  userCommentVotes: commentVotesReducer,
  userBookmarks: userBookmarksReducer,
  notification: notificationReducer,
  subscribedGroups: groupSubscribesReducer,
  redirectPath: redirectReducer,
  toast: toastReducer
});

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;
