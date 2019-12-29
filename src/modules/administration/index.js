/* eslint-disable react/jsx-filename-extension */
/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
import React from "react";
import ReactDOM from "react-dom";
import WebFont from "webfontloader";

import createBrowserHistory from "history/createBrowserHistory";
import "material-design-icons/iconfont/material-icons.css";

import store from "Modules/administration/flux/configureStore";

import * as ServiceWorkersManager from "Src/service-workers";
import App from "./app";

const createdBrowserHistory = createBrowserHistory();

const mountPoint = document.getElementById("app");

if (process.env.NODE_ENV !== "production") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    onlyLogs: true,
    titleColor: "green",
    diffNameColor: "aqua"
  });
}

ReactDOM.render(
  <App store={store} history={createdBrowserHistory} />,
  mountPoint
);

WebFont.load({
  custom: {
    families: ["Lato"],
    urls: ["/assets/fonts/fonts.css"]
  }
});

ServiceWorkersManager.register();

// if (module.hot) {
//   module.hot.accept();
// }

// https://scotch.io/tutorials/how-to-make-your-existing-react-app-progressive-in-10-minutes
// https://survivejs.com/webpack/building/bundle-splitting/

// chrome://flags/#enable-desktop-pwas
// chrome://flags#enable-app-banners
