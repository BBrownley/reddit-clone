import styled from "styled-components";
import { FormContainer } from "../shared/Form.elements";

export const StyledFormContainer = styled(FormContainer)`
  margin: 0;
`;

export const CommentCountSm = styled.span`
  font-size: 1.5rem;
  color: #777777;
  display: inline-block;
  @media (min-width: 1041px) {
    display: none;
  }
`;

export const CommentCountLg = styled.span`
  font-size: 1.5rem;
  color: #777777;
  @media (max-width: 1040px) {
    display: none;
  }
`;
