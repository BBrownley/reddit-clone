import React from 'react'
import {Link} from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>Click <Link to="/">here</Link> to go back to the homepage</p>
    </div>
  )
}
