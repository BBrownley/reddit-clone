import styled from "styled-components";

export const Card = styled.div`
  border: 1px solid #eee;
  padding: 0.5em;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.1);
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
`;

export const GroupBlurb = styled.p`
  color: #999;
  margin-top: 0.7em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 8;
  -webkit-box-orient: vertical;

  /* Adjust line count and font size for different screen lengths */

  @media (max-width: 1220px) {
    -webkit-line-clamp: 6;
  }

  @media (max-width: 1075px) {
    -webkit-line-clamp: 8;
  }

  @media (max-width: 925px) {
    -webkit-line-clamp: 6;
  }

  @media (max-width: 800px) {
    font-size: 1.5rem;
  }

  @media (max-width: 680px) {
    font-size: 1.5rem;
    -webkit-line-clamp: 4;
  }

  @media (max-width: 568px) {
    font-size: 1.75rem;
    -webkit-line-clamp: 8;
  }

  @media (max-width: 512px) {
    -webkit-line-clamp: 6;
  }

  @media (max-width: 414px) {
    -webkit-line-clamp: 4;
  }
`;

export const CardWrapper = styled.div`
  width: 100%;
  display: inline-block;
  position: relative;
  &:after {
    padding-top: 100%;
    /* 16:9 ratio */
    display: block;
    content: "";
  }
`;
