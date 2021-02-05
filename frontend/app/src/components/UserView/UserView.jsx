import React, { useState, useEffect } from "react";
import { useRouteMatch } from "react-router-dom";
import userService from "../../services/users";
import userPostService from "../../services/posts";

import moment from "moment";

export default function UserView() {
  const [user, setUser] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const match = useRouteMatch("/users/:id");

  console.log(match.params.id);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await userService.getUser(match.params.id);
      setUser(userData);
    };

    const fetchUserPosts = async () => {
      const userPostData = await userPostService.getUserPosts(match.params.id);
      setUserPosts(userPostData);
    };

    fetchUser();
    fetchUserPosts();
  }, []);

  return (
    <div>
      <h1>{user.username}</h1>
      <p>Account created {moment(user.created_at).fromNow()}</p>
      {userPosts.map(post => {
        
      })}
    </div>
  );
}
