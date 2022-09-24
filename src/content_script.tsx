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