import styled from "styled-components";
import { FormContainer } from "../shared/Form.elements";

export const Container = styled.div`
  .new-thread textarea {
    height: 10rem;
  }

  .login-comment-msg {
    margin: 2rem 0;
    font-size: 1.5rem;
  }
`;

export const StyledFormContainer = styled(FormContainer)`
  margin: 2rem auto 2rem 0;
  h3 {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`;
