chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action == "send_translated_value") {
    alert(msg.value);
    sendResponse("translate text  " + msg.value);
  }
  if (msg.action == "translated_quiz") {
    alert(msg.value);
  }
   else {
    sendResponse("translate none.");
  }
});
const start2 = () => {
  chrome.storage.sync.get("translated_history",
    function(data:any) {
      if (data?.translated_history){
        let ask = data.translated_history[Math.floor(Math.random()*data?.translated_history.length)]
        ask.translated = ask.translated.replace(/[a-s]+/g, "*")
        let string = `${ask.source} meaning ${ask.translated}, động não đi ông già`
        alert(string)
      }
    })
}
setInterval(start2, 5 * 60 * 1000);