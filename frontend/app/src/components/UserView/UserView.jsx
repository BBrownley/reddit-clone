import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import userService from "../../services/users";
import postService from "../../services/posts";

import PostList from "../PostList/PostList";

import moment from "moment";

export default function UserView() {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const match = useRouteMatch("/users/:id");

  const [sortBy, setSortBy] = useState("new");
  const [searchBy, setSearchBy] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");

  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await userService.getUser(match.params.id);
      setUser(userData);
    };

    const fetchUserPosts = async () => {
      const userPostData = await postService.getUserPosts(match.params.id);
      console.log(userPostData);
      setUserPosts(userPostData);
    };

    fetchUser();
    fetchUserPosts();
  }, []);

  const handleSortBy = e => {
    const sortValue = e.target.value;
    setSortBy(sortValue);
  };

  const handleSearchBy = e => {
    const searchByValue = e.target.value;
    setSearchBy(searchByValue);
  };

  const handleSearchTerm = e => {
    const searchByValue = e.target.value;
    setSearchTerm(searchByValue);
  };

  const resetFilters = () => {
    setSearchBy("title");
    setSearchTerm("");
  };

  const handleSendMessageButton = () => {
    history.push({
      pathname: "/messages/compose",
      state: {
        recipient_id: user.id
      }
    });
  }

  return (
    <div>
      <h1>{user.username}</h1>
      <button onClick={handleSendMessageButton}>Send message</button>

      <p>Account created {moment(user.created_at).fromNow()}</p>
      <div>
        <strong>Sort posts by:</strong>
        <select
          name="sortBy"
          id="sort-by"
          onChange={handleSortBy}
          value={sortBy}
        >
          <option value="new">New</option>
          <option value="top">Top</option>
          <option value="followers">Followers</option>
          <option value="commentsDesc">Comments (high to low)</option>
          <option value="commentsAsc">Comments (low to high)</option>
        </select>
        <strong>
          Search posts by{" "}
          <select
            name="searchOption"
            id="search-option"
            onChange={handleSearchBy}
            value={searchBy}
          >
            <option value="title">Title</option>
            <option value="content">Content</option>
          </select>
          :{" "}
        </strong>
        <input onChange={handleSearchTerm} value={searchTerm}></input>
        <button className="button-small no-shadow ml-10" onClick={resetFilters}>
          Clear search
        </button>
      </div>
      <PostList
        sortBy={sortBy}
        searchBy={searchBy}
        searchTerm={searchTerm}
        posts={userPosts}
      />
    </div>
  );
}
