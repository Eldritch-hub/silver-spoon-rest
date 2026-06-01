import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";

import { CartProvider } from "./context/cartContext.jsx";

import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <CartProvider>

        <App />

      </CartProvider>

    </BrowserRouter>

  </React.StrictMode>

);