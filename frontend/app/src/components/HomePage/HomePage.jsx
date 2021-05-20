import React, { useEffect, useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import moment from "moment";

import Link from "../shared/NavLink.elements";

import FontAwesome from "react-fontawesome";

import PostList from "../PostList/PostList";

import postService from "../../services/posts";

import { setUser } from "../../reducers/userReducer";

const Container = styled.div`
  .pagination-button {
    font-size: 1rem;
    &.previous {
      margin-right: 1rem;
    }
    &.next {
      margin-left: 1rem;
    }
  }
  input {
    width: 3rem;
    text-align: center;
  }
`;

export default function HomePage() {
  const user = useSelector(state => state.user);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(currentPage);
  const [maxPages, setMaxPages] = useState(null); // Determined by DB query
  const [paginationOptions, setPaginationOptions] = useState({
    type: "ALL_POSTS",
    user: user.userId
  });
  const [postsToDisplay, setPostsToDisplay] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const handlePageInput = e => {
    // Allow integers only

    let sanitizedInput = "";

    for (let i = 0; i < e.target.value.length; i++) {
      const currentCharCode = e.target.value.charAt(i).charCodeAt(0);
      if (currentCharCode >= 48 && currentCharCode <= 57) {
        sanitizedInput = sanitizedInput.concat(e.target.value.charAt(i));
      }
    }

    // Cannot exceed max pages, must be at least 1
    if (parseInt(sanitizedInput) > maxPages) {
      sanitizedInput = maxPages;
    } else if (sanitizedInput.length === 0) {
      sanitizedInput = 1;
    }

    setPageInput(sanitizedInput);
    setCurrentPage(sanitizedInput);
  };

  const handlePrevButton = () => {
    setCurrentPage(prevState => prevState - 1);
    setPageInput(prevState => prevState - 1);
    window.scrollTo(0, 0);
  };

  const handleNextButton = () => {
    setCurrentPage(prevState => prevState + 1);
    setPageInput(prevState => prevState + 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Get the max # of pages needed on load

    postService.countPages(paginationOptions).then(result => {
      setMaxPages(result);
    });

    if (user.userId !== null) {
      setPaginationOptions(prevState => ({ ...prevState, user: user.userId }));
    } else {
      // On user logout
      setPaginationOptions(prevState => ({ ...prevState, user: null }));
    }
  }, [user]);

  useEffect(() => {
    // When the page changes, fetch the appropriate data
    if (paginationOptions.type === "ALL_POSTS") {
      postService.paginate(paginationOptions, currentPage).then(data => {
        setPostsToDisplay(data);
        setLoading(false);
      });
    }
  }, [currentPage, paginationOptions]);

  return (
    <div>
      <Container>
        {maxPages === 0 && (
          <h2>
            Subscribe to your favorite <Link to="/groups">groups</Link> to stay
            up to date with the content you love ❤️
          </h2>
        )}
        {!loading && (
          <PostList searchBy="title" searchTerm="" posts={postsToDisplay} />
        )}
        {maxPages !== 0 && (
          <>
            {currentPage > 1 && (
              <button
                className="pagination-button previous"
                onClick={handlePrevButton}
              >
                Previous
              </button>
            )}

            <span>
              Page{" "}
              <input type="text" value={pageInput} onChange={handlePageInput} />{" "}
              of {maxPages}
            </span>
            {currentPage < maxPages && (
              <button
                className="pagination-button next"
                onClick={handleNextButton}
              >
                Next
              </button>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
