import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "wingcss";
import Bootstrap from "./components/Bootstrap/Bootstrap";

serviceWorker.register();

ReactDOM.render(<Bootstrap />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
