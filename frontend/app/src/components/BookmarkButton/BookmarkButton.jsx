import React from "react";
import { useDispatch } from "react-redux";

import {
  addBookmark,
  deleteBookmark
} from "../../reducers/userBookmarksReducer";

export default function BookmarkButton({ bookmarked, commentId }) {
  const dispatch = useDispatch();

  const handleAddBookmark = commentId => {
    dispatch(addBookmark(commentId));
  };

  const handleDeleteBookmark = commentId => {
    dispatch(deleteBookmark(commentId));
  };

  return (
    <li className={`${bookmarked ? "active" : ""}`}>
      {bookmarked ? (
        <span onClick={() => handleDeleteBookmark(commentId)}>Unbookmark</span>
      ) : (
        <span onClick={() => handleAddBookmark(commentId)}>Bookmark</span>
      )}
    </li>
  );
}
