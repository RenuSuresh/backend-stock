let { SmartAPI, WebSocket, WebSocketClient } = require("smartapi-javascript");
// Old websocket
const API_KEY = "8PcJjrTP";
const FEED_TOKEN = "0cf9c8de-71cd-4d12-863c-b516be316fe8";
const CLIENT_CODE = "AB1234";
const jwttoken =
  "Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ4OD MiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwia WF0IjoxNTk5NzEyNjk4LCJleHAiOjE1OTk3MjE2OTh 9.qHZEkOMokMktybarQO3m4NMRVQlF0vvN7rh2lC Rkjd2sCYBq3JnOq0yWWOS5Ux_H0pvvt4-ibSmb5H JoKJHOUw";

let web_socket = new WebSocketClient({
  clientcode: CLIENT_CODE,
  jwttoken: jwttoken,
  apikey: API_KEY,
  feedtype: FEED_TOKEN,
});

web_socket.connect().then(() => {
  web_socket.fetchData("subscribe", "order_feed"); // ACTION_TYPE: subscribe | unsubscribe FEED_TYPE: order_feed

  setTimeout(function () {
    web_socket.close();
  }, 60000);
});

web_socket.on("tick", receiveTick);

function receiveTick(data) {
  console.log("receiveTick:::::", data);
}
