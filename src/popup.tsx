import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import ReactDOM from "react-dom";
import Translate from "./table";

import Tabs from "./tabs";

// let getTranslateHistory = async () => {
//   return new Promise((resolve: any, reject: any) => {
//     chrome.storage.local.get(
//       {
//         translated_history: [],
//       },
//       function (data) {
//         resolve(data.translated_history);
//         localStorage.setItem(
//           "translated_history",
//           JSON.stringify(data.translated_history)
//         );
//       }
//     );
//   });
// };

// let clearStore = () => {
//   chrome.storage.local.clear();
// };

// const Popup = () => {
//   getTranslateHistory();
//   let dataRender: any = localStorage.getItem("translated_history");
//   try {
//     dataRender = JSON.parse(dataRender);
//   } catch {
//     console.log("Cannot parse translated history to json!");
//   }
//   return <Translate children={dataRender} />;
// };

ReactDOM.render(
  <React.StrictMode>
    {/* <Popup />
    <Button color="primary" onClick={clearStore}>
      Clear
    </Button> */}
    <Tabs />
  </React.StrictMode>,
  document.getElementById("root")
);
