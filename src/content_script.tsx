// import React from 'react';
// // import { createRoot } from 'react-dom';

// import ReactDOM from "react-dom";
// import App from './test'

// const body = document.querySelector('body')
// const app = document.createElement('div')
// app.id = 'react-root'
// if (body) {
//   body.prepend(app)
// }
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action == "send_translated_value") {
    alert(msg.value);
    sendResponse("translate text  " + msg.value);
  }
  if (msg.action == "translated_quiz") {
    alert(msg.value);
    // <Alert color='info'>No flights listed</Alert>
    // ReactDOM.render(
    //   <React.StrictMode>
    //     <App />
    //   </React.StrictMode>,
    //   document.getElementById("react-root")
    // );
    sendResponse("quiz  " + msg.value);
  }
  if (msg.action == "saved_reminder") {
    alert(msg.value);
    sendResponse("text reminding" + msg.value);
  }
  if (msg.action == "reminder") {
    alert(msg.value);
    sendResponse("text reminding" + msg.value);
  }
  if (msg.action == "ping") {
    sendResponse("pong service worker!");
  }
});
