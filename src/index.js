import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "mobx-react";
import CombinedStore from "./store";
import "antd/dist/antd.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider {...new CombinedStore()}>
        <App />
    </Provider>
);

reportWebVitals();
