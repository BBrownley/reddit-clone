import moment from "moment";

const filterPosts = (posts, searchBy, searchTerm) => {
  let result = posts.filter(post => {
    if (searchBy === "title") {
      return post.title.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (searchBy === "content") {
      return post.content.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return post;
    }
  });

  // Filter results if search is used
  if (!!searchTerm) {
    result = result.filter(post => {
      if (searchBy === "title") {
        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchBy === "content") {
        return post.content.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return post;
      }
    });
  }
  return result;
};

const sortPosts = (posts, sortBy) => {
  return posts.sort((a, b) => {
    switch (sortBy) {
      case "new":
        const timestampA = moment(a.created_at);
        const timestampB = moment(b.created_at);

        return timestampA.isAfter(timestampB) ? -1 : 1;
      case "top":
        return b.score - a.score;
      case "followers":
        return b.followers - a.followers;
      default:
        return null;
    }
  });
};

const postListHelpers = {
  filterPosts,
  sortPosts
};

export default postListHelpers;
