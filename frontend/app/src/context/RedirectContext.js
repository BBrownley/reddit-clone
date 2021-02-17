import React, { createContext, useState } from "react";

export const RedirectContext = createContext();

const RedirectProvider = () => {
  const [link, setLink] = useState(null);

  const setRedirectLink = link => {
    setLink(link);
  };

  const clearRedirectLink = () => {
    setLink(null);
  };

  return (
    <RedirectContext.Provider
      value={{ link, setRedirectLink, clearRedirectLink }}
    />
  );
};

export default RedirectProvider;
