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
  width: 100%;
  img {
    display: inline-block;
    width: 40px;
    position: absolute;
    top: 10px;
    /* background-color: purple; */
  }
`;

export const MainContent = styled.div`
  padding-top: 5px;
  /* padding-left: 50px; */
  padding-right: 1rem;
  line-height: 1.75;

  display: inline-block;

  left: 0;
  width: 100%;
  a {
    color: blue;
    margin-right: 10px;
  }
  .comment {
    display: inline-block;
    min-height: 50px;
  }
  .comment-options {
    display: flex;
    align-items: flex-start;
    margin-top: -0.5rem;
    margin-right: 1rem;
    > div:first-of-type {
      margin-right: 1rem;
    }
    .button-group {
      margin-top: -0.5rem;
    }
  }
`;

export const CommentVotes = styled.span`
  /* background-color: cyan; */
  /* margin-left: -5px;
  margin-right: 5px;
  margin-top: 1rem;
  span {
    margin-left: .1875rem;
  } */

  display: flex;
  flex-direction: column;
  align-items: center;

  .comment-score {
    margin: 0.5rem 0;
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
  max-width: 100%;
  button {
    margin-right: 20px;
    font-size: 1rem;
  }
  .form-bottom {
    display: flex;
    justify-content: space-between;
    .warning {
      color: red;
    }
  }
`;

export const ReplyInput = styled.textarea`
  margin: 0.625rem 0;
  padding: 0.5rem;
  width: 75%;
  max-width: 100%;
  height: 10rem;
  min-width: 50%;
  min-height: 5rem;
  border-radius: 0.25rem;
  display: block;
  font-family: "Open Sans", sans-serif;
  button {
    margin-right: 1.25rem;
  }
`;
