function polling() {
  // console.log("polling");
  setTimeout(polling, 1000 * 30);
}

polling();

function searchTerapeak(word:any){
  var source = word.selectionText;
  // chrome.tabs.create({url: `https://translate.google.com/?sl=en&tl=vi&text=${query}&op=translate`});
  console.log(`Translated keyword "${source}"`)  
  chrome.tabs.query({active: true, currentWindow: true}, async (tabs:any) => {
    let translatedRaw:any = await TEST_HTTPREQUEST(source)
    let translated = ParseDataTranslateFromGG(translatedRaw)
    chrome.tabs.sendMessage(tabs[0].id, {action: "send_translated_value", value : translated});
    console.log(`Source text: ${source} meaning ${translated}`)
    chrome.storage.sync.get("translated_history",
    function(data:any) {
      if (!data?.translated_history){
        data.translated_history = [{source, translated}]
      }else{
        data.translated_history.unshift({source, translated})
      }
      console.log(data)
      chrome.storage.sync.set({
        translated_history: data.translated_history
      }, function() {
          console.log("Save translated history successful!");
      });
    }
  )}
)};

async function TEST_HTTPREQUEST(sourceString:string) {
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

function ParseDataTranslateFromGG(raw:string){
  try{
    let jsonRaw = JSON.parse(raw)
    let dataContainer = jsonRaw[0]
    let translateResult = ""
    let rootText = ""
    for(let qoute of dataContainer){
      translateResult += qoute[0]
      rootText += qoute[1]
    }
    return translateResult

  }catch(e){
    console.dir(e, {depth : null})
    return `Parse translate string error ${e}`
  }
}


chrome.contextMenus.removeAll(function() {
  chrome.contextMenus.create({
   id: "1",
   title: "Translate to Vi",
   contexts:["selection"],  // ContextType
  }); })

chrome.contextMenus.onClicked.addListener(searchTerapeak);

const start = () => {
  console.log('go here')
    chrome.tabs.query({active: true, currentWindow: true}, async (tabs:any) => {
      chrome.storage.sync.get("translated_history",
      function(data:any) {
        if (data?.translated_history){
          let ask = data.translated_history[Math.floor(Math.random()*data?.translated_history.length)]
          ask.translated = ask.translated.replace(/[a-s]+/g, "*")
          chrome.tabs.sendMessage(tabs[0].id, {action: "translated_quiz", value : `${ask.source} meaning ${ask.translated}, động não đi ông già`});
        }
      }
    )
  })
}
setInterval(start, 5 * 60 * 1000);