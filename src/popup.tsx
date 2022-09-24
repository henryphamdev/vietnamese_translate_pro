import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import ReactDOM from "react-dom";
import Translate from "./table";

let getTranslateHistory = async () => {
  return new Promise((resolve:any, reject:any) => {
    chrome.storage.sync.get({
      translated_history:[]
    },
    function(data) {
      resolve(data.translated_history)
      localStorage.setItem("translated_history", JSON.stringify(data.translated_history))
    })
  })
}

let clearStore = () => {
  chrome.storage.sync.clear()
}

const Popup = () => {
  getTranslateHistory()
  let dataRender:any = localStorage.getItem("translated_history")
  try{
    dataRender = JSON.parse(dataRender)
  }catch{
    console.log("Cannot parse translated history to json!");
  }
  return (
    <Translate children={dataRender} />
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
    <Button color="primary" onClick={clearStore}>Clear</Button>
  </React.StrictMode>,
  document.getElementById("root")
);
