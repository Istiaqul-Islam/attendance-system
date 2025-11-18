// src/components/layout/MainLayout.js

import React from "react";
import "./MainLayout.scss";

const MainLayout = ({ children }) => {
  // This is a simple presentational component. It takes children (the page content from App.js)
  // and wraps them in a <main> tag with a specific class for consistent styling.
  return <main className="main-content-container">{children}</main>;
};

export default MainLayout;
