import axios from "axios";

let storedToken = null;
const baseUrl = process.env.BASE_URL || "http://localhost:5000";

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
  const req = await axios.get("http://localhost:5000/posts", config);
  return req.data;
};

// const getPostsByUID = async userId => {
//   const req = await axios.get(
//     `http://localhost:5000/posts/users/${userId}`,
//     config
//   );
//   const data = req.data.map(post => {
//     return {
//       ...post,
//       type: "post"
//     };
//   });
//   return data;
// };

const getUserPosts = async userId => {
  const req = await axios.get(
    `http://localhost:5000/posts/users/${userId}`,
    config
  );
  console.log(req.data);
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
    const req = await axios.get(`http://localhost:5000/posts/follows/`, config);
    return req.data;
  } catch (error) {
    return { error: error.response.data.error };
  }
};

const editPost = async (id, newValue) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: storedToken
    }
  };

  axios.put(`http://localhost:5000/posts/${id}`, { newValue }, config);
};

const paginate = async (options, page) => {
  if (options.type === "ALL_POSTS") {
    // Fetch 20 posts by creation date

    const userId = options.user || null;

    const req = await axios.get(
      `${baseUrl}/posts/all?user=${userId}&page=${page}`
    );

    return req.data;
  }

  if (options.type === "GROUP_POSTS") {
    console.log("yo");
    const req = await axios.get(
      `${baseUrl}/posts/group?groupName=${options.groupName}&page=${page}`
    );
    console.log(req.data);
    return req.data;
  }
};

const countPages = async options => {
  const config = {
    headers: {
      Authorization: storedToken
    }
  };

  let req;

  if (options.type === "ALL_POSTS") {
    if (storedToken === null) {
      req = await axios.get(`${baseUrl}/posts/all/count`);
    } else {
      req = await axios.get(`${baseUrl}/posts/all/count/user`, config);
    }
  } else if (options.type === "GROUP_POSTS") {
    req = await axios.get(
      `${baseUrl}/posts/group/count?groupName=${options.groupName}`
    );
  }

  return req.data.pages;
};

const getPostById = async postId => {
  const req = await axios.get(`${baseUrl}/posts/${postId}`);
  return req.data;
};

const getPostScore = async postId => {
  const req = await axios.get(`${baseUrl}/postvotes/score/${postId}`);
  return req.data;
};

const postService = {
  getAll,
  createPost,
  setToken,
  vote,
  removePost,
  getUserPosts,
  followPost,
  unfollowPost,
  getPostFollows,
  editPost,
  paginate,
  countPages,
  getPostById,
  getPostScore
};

export default postService;
