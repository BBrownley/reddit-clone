import React from "react";
import { useDispatch } from "react-redux";

import {
  addBookmark,
  deleteBookmark
} from "../../reducers/userBookmarksReducer";

export default function BookmarkButton({ bookmarked, commentId }) {
  const dispatch = useDispatch();

  const handleAddBookmark = commentId => {
    console.log(`add bookmark comment ${commentId}`);

    dispatch(addBookmark(commentId));
  };

  const handleDeleteBookmark = commentId => {
    console.log(`Remove bookmark comment ${commentId}`);

    dispatch(deleteBookmark(commentId));
  };

  return (
    <>
      {bookmarked ? (
        <span onClick={() => handleDeleteBookmark(commentId)}>Unbookmark</span>
      ) : (
        <span onClick={() => handleAddBookmark(commentId)}>Bookmark</span>
      )}
    </>
  );
}
