import React, { useState } from "react";
import { FormContainer, FormHeader, FormField } from "../shared/Form.elements";
import usersService from "../../services/users";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSetUsername = e => {
    setUsername(e.target.value);
  };

  const handleSetEmail = e => {
    setEmail(e.target.value);
  };

  const handleSetPassword = e => {
    setPassword(e.target.value);
  };

  const handleSetConfirmPassword = e => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmitForm = e => {
    e.preventDefault();
    const data = { username, email, password, confirmPassword };
    console.log(data);
    usersService.register(data);
  };

  return (
    <FormContainer>
      <FormHeader>Register</FormHeader>
      <form id="register-form" onSubmit={handleSubmitForm}>
        <FormField>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleSetUsername}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleSetEmail}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleSetPassword}
          ></input>
        </FormField>
        <FormField>
          <label htmlFor="confirm-password">Confirm password:</label>
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            value={confirmPassword}
            onChange={handleSetConfirmPassword}
          ></input>
        </FormField>
      </form>
      <button type="submit" form="register-form">
        Register
      </button>
    </FormContainer>
  );
};

export default RegisterForm;
