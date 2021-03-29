import styled from "styled-components";
import FontAwesome from "react-fontawesome";

export const Container = styled.div`
  border-radius: 5px;
  border-left: 1px solid #ccc;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #bbb;
  padding: 0px 0 10px 10px;
  margin-top: 10px;
  color: black;
  position: relative;
  img {
    display: inline-block;
    width: 40px;
    position: absolute;
    top: 10px;
    /* background-color: purple; */
  }
`;

// export const Container = styled.div`
//   margin-bottom: 10px;
//   position: relative;
//   background-color: gray;
//   vertical-align: top;
//   img {
//     display: inline-block;
//     width: 40px;
//     position: absolute;
//     top: 0;
//     background-color: purple;
//   }
// `;

export const MainContent = styled.div`
  padding-top: 5px;
  padding-left: 50px;
  padding-right: 150px;
  line-height: 1.75;

  display: inline-block;

  left: 0;
  a {
    color: blue;
    margin-right: 10px;
  }
  .comment {
    display: inline-block;
    min-height: 50px;
  }
`;

export const CommentVotes = styled.span`
  /* background-color: cyan; */
  margin-left: -5px;
  margin-right: 5px;
  span {
    margin: 0 5px;
  }
`;

export const CommentVoteButton = styled(FontAwesome)`
  color: ${props => {
    if (props.upvoted) {
      return props.theme.cornflowerBlue;
    } else if (props.downvoted) {
      return props.theme.crimson;
    } else {
      return "#CCCCCC";
    }
  }};
  &:hover {
    cursor: pointer;
    opacity: 0.75;
  }
`;

export const CommentAge = styled.div`
  text-align: right;
  /* background-color: green; */
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 10px;
`;

export const ReplyForm = styled.div`
  button {
    margin-right: 20px;
    font-size: 1rem;
  }
`;

export const ReplyInput = styled.textarea`
  margin: 10px 0;
  padding: 0.5rem;
  width: 600px;
  height: 100px;
  min-width: 100px;
  min-height: 100px;
  border-radius: 5px;
  display: block;
  font-family: "Open Sans", sans-serif;
  button {
    margin-right: 20px;
  }
`;
