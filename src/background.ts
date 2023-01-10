import * as listWords from "./600"
function searchTerapeak(contextMenu: any) {

  var source = contextMenu.selectionText;
  if (contextMenu.menuItemId == "translate") {
    console.log(`${new Date().toISOString()} Translated keyword "${source}"`)
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any) => {
      let translatedRaw: any = await TEST_HTTPREQUEST(source)
      let translated = ParseDataTranslateFromGG(translatedRaw)
      chrome.tabs.sendMessage(tabs[0].id, { action: "send_translated_value", value: translated });
      console.log(`${new Date().toISOString()} Source text: ${source} meaning ${translated}`)
      chrome.storage.sync.get("translated_history",
        function (data: any) {
          if (!data?.translated_history) {
            data.translated_history = [{ source, translated }]
          } else {
            data.translated_history.unshift({ source, translated })
          }
          console.log(data)
          chrome.storage.sync.set({
            translated_history: data.translated_history
          }, function () {
            console.log(`${new Date().toISOString()} Save translated history successful!`);
          });
        }
      )
    })
  }
  if (contextMenu.menuItemId == "reminder") {
    console.log(`${new Date().toISOString()} Add qouta to remind: "${source}"`)
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "saved_reminder", value: source });
      chrome.storage.sync.get("reminder",
        function (data: any) {
          if (!data?.reminder) {
            data.reminder = [{ source, translated: "" }]
          } else {
            data.reminder.unshift({ source, translated: "" })
          }
          console.log(data)
          chrome.storage.sync.set({
            reminder: data.reminder
          }, function () {
            console.log(`${new Date().toISOString()} Save translated history successful!`);
          });
        }
      )
    })
  }
  // chrome.tabs.create({url: `https://translate.google.com/?sl=en&tl=vi&text=${query}&op=translate`});
};

async function TEST_HTTPREQUEST(sourceString: string) {
  return new Promise((resolve, reject) => {
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${sourceString}&ie=UTF-8&oe=UTF-8`, {
      // headers: {
      //   "content-type": "application/json"
      // },
      method: "GET",
      // credentials: "include"
    })
      .then(res1 => res1.text())
      .then(res2 => {
        return resolve(res2);
      })
      .catch(e => {
        return reject(e);
      });
  });
}

function ParseDataTranslateFromGG(raw: string) {
  try {
    let jsonRaw = JSON.parse(raw)
    let dataContainer = jsonRaw[0]
    let translateResult = ""
    let rootText = ""
    for (let qoute of dataContainer) {
      translateResult += qoute[0]
      rootText += qoute[1]
    }
    return translateResult

  } catch (e) {
    console.dir(e, { depth: null })
    return `Parse translate string error ${e}`
  }
}


chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: "translate",
    title: "⛽ Translate to Vi",
    contexts: ["selection"],  // ContextType
  });

  chrome.contextMenus.create({
    id: "reminder",
    title: "⛳ Add to Reminder",
    contexts: ["selection"],  // ContextType
  })
})

chrome.contextMenus.onClicked.addListener(searchTerapeak);

const start = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any) => {
    chrome.storage.sync.get("translated_history",
      async function (data: any) {
        if (data?.translated_history) {
          let ask = data.translated_history[Math.floor(Math.random() * data?.translated_history.length)]
          ask.translated = ask.translated.replace(/[a-s]+/g, "*")
          if (!tabs.length) {
            console.log(`${new Date().toISOString()} Cannot get active tab`)
          } else {
            chrome.tabs.sendMessage(tabs[0].id, { action: "translated_quiz", value: `${ask.source} meaning ${ask.translated}, động não đi ông già` }, (res: any) => {
              console.log(`${new Date().toISOString()} Response from reciever: ${res}`)
            });
          }
        }
      }
    )
  })
}

const alert600Words = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any) => {
    let data: any = listWords
    let ask = data[Math.floor(Math.random() * data.length)]
    ask.translated = ask.translated.replace(/[a-s]+/g, "*")
    if (!tabs.length) {
      console.log(`${new Date().toISOString()} Cannot get active tab`)
    } else {
      chrome.tabs.sendMessage(tabs[0].id, { action: "translated_quiz", value: `${ask.source} meaning ${ask.translated}, động não đi ông già` }, (res: any) => {
        console.log(`${new Date().toISOString()} Response from reciever: ${res}`)
      });
    }
  })
}

const reminder = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs: any) => {
    chrome.storage.sync.get("reminder",
      async function (data: any) {
        if (data?.reminder) {
          let ask = data.reminder[Math.floor(Math.random() * data?.reminder.length)]
          if (!tabs.length) {
            console.log(`${new Date().toISOString()} Cannot get active tab`)
          } else {
            chrome.tabs.sendMessage(tabs[0].id, { action: "reminder", value: ask.source }, (res: any) => {
              console.log(`${new Date().toISOString()} Response from reciever: ${res}`)
            });
          }
        }
      }
    )
  })
}


chrome.alarms.create("remind_english_translated", {
  delayInMinutes: 6,
  periodInMinutes: 6
});

chrome.alarms.create("reminder", {
  delayInMinutes: 2,
  periodInMinutes: 2
});


chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === "remind_english_translated") {
    start();
    alert600Words();
  }
  if (alarm.name === "reminder") {
    reminder();
  }
});
// setInterval(start, 5 * 60 * 1000);

// setInterval(() => {
//   chrome.tabs.query({active: true, currentWindow: true}, async (tabs:any) => {
//     chrome.tabs.sendMessage(tabs[0].id, {action: "ping", value : `ping reciever`}, (res:any) => {
//       console.log(`Response from reciever: ${res}`)
//     });
//   })
// }, 30 * 1000)