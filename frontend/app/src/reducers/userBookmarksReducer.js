import bookmarkService from "../services/bookmarks";

const initialState = [];

export const initializeBookmarks = (postId = null) => {
  return async dispatch => {
    let bookmarks;

    if (postId === null) {
      bookmarks = await bookmarkService.getAllBookmarks();
    } else {
      bookmarks = await bookmarkService.getBookmarksByPostId(postId);
    }

    dispatch({
      type: "INITIALIZE_BOOKMARKS",
      bookmarks
    });
  };
};

export const addBookmark = commentId => {
  return async dispatch => {
    const newBookmark = await bookmarkService.addBookmark(commentId);

    dispatch({
      type: "ADD_BOOKMARK",
      newBookmark
    });
  };
};

export const deleteBookmark = commentId => {
  return async dispatch => {
    await bookmarkService.deleteBookmark(commentId);

    dispatch({
      type: "DELETE_BOOKMARK",
      commentId
    });
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INITIALIZE_BOOKMARKS":
      return [...action.bookmarks];
    case "ADD_BOOKMARK":
      return [...state, action.newBookmark];
    case "DELETE_BOOKMARK":
      return state.filter(bookmark => {
        return bookmark.comment_id !== action.commentId;
      });
    default:
      return state;
  }
};

export default reducer;
