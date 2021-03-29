import axios from "axios";

let storedToken = null;

const setToken = token => {
  storedToken = token;
};

const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  }
};

const getAll = async () => {
  const req = await axios.get("http://localhost:5000/", config);

  return req.data;
};

const getPostsByUID = async userId => {
  const req = await axios.get(
    `http://localhost:5000/posts/users/${userId}`,
    config
  );
  return req.data;
};

const getByUser = async user => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: user.token
    }
  };

  const req = await axios.get(
    "http://localhost:5000/posts/verifyuserposts",
    config
  );
  return req.data;
};

const getUserPosts = async userId => {
  const req = await axios.get(`http://localhost:5000/posts/${userId}`, config);
  console.log(req);
  return req.data;
};

const createPost = async post => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.post("http://localhost:5000/posts", post, config);

    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const vote = async (postID, value) => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  const body = {
    value
  };
  const data = await axios.post(
    `http://localhost:5000/posts/${postID}/vote`,
    body,
    config
  );

  return data;
};

const removePost = async postId => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  try {
    await axios.delete(`http://localhost:5000/posts/${postId}`, config);
    return;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const followPost = async postId => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.post(
      "http://localhost:5000/posts/follow",
      { postId },
      config
    );
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const unfollowPost = async postId => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  try {
    const req = await axios.delete(
      `http://localhost:5000/posts/unfollow/${postId}`,
      config
    );
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const getPostFollows = async () => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };
  try {
    const req = await axios.get(
      `http://localhost:5000/posts/follows/`,
      config
    );
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
}

const editPost = async (id, newValue) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  axios.put(`http://localhost:5000/posts/${id}`, {newValue}, config);
}

const postService = {
  getAll,
  getByUser,
  createPost,
  setToken,
  vote,
  removePost,
  getUserPosts,
  getPostsByUID,
  followPost,
  unfollowPost,
  getPostFollows,
  editPost
};

export default postService;
