import React from "react";
import { useSelector } from "react-redux";

export default function FormWarning() {
  const notification = useSelector(state => state.notification);

  return (
    <div>
      <h1>{notification}</h1>
    </div>
  );
}
