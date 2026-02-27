import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import reducers from "./redux/reducers";

import "./assets/boxicons-2.0.7/css/boxicons.min.css";
import "./assets/css/grid.css";
import "./assets/css/theme.css";
import "./assets/css/index.css";

import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";

const user = () => {
  const userLogin = JSON.parse(localStorage.getItem("profile"));

  return userLogin;
};

const store = configureStore({
  reducer: reducers,
});

document.title = "WAMAS | Waste Management System";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      {user() === null ? (
        <Login />
      ) : (
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      )}
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
