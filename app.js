const http = require("http");
const express = require("express");
const WebSocket = require("ws");
const {
  rtConnect,
  rtSubscribe,
  rtUnsubscribe,
  rtFeed,
  historical,
  formatTime,
} = require("truedata-nodejs");
const app = express();
const port = 8845;
const user = "tdws150";
const pwd = "shubham@150";
const portSocket = 8082;
const symbols = [
  "NIFTY 50",
  "SBIN",
  "IOC",
  "HDFCBANK",
  "POWERGRID",
  "RELIANCE",
  "HINDUNILVR",
  "DIVISLAB",
  "ICICIBANK",
  "SUNPHARMA",
  "NESTLEIND",
  "ASIANPAINT",
  "HDFC",
  "SBILIFE",
  "INFY",
  "ITC",
  "BHARTIARTL",
  "AXISBANK",
  "TITAN",
  "TATACONSUM",
];
app.use("/", express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

var data = "Real-Time Update 1";
var number = 1;
var touchlineData;
var tickData = {};
var bidaskData;
var barData;
for (const symbol of symbols) {
  tickData[symbol] = {};
}

rtConnect(user, pwd, symbols, portSocket, (bidask = 1), (heartbeat = 1));
rtFeed.on("touchline", touchlineHandler); // Receives Touchline Data
rtFeed.on("tick", tickHandler); // Receives Tick data
// rtFeed.on("bidask", bidaskHandler); // Receives Bid Ask Data if enabled
// rtFeed.on("bar", barHandler); // Receives 1min and 5min bar data

function touchlineHandler(touchline) {
  const altObj = Object.fromEntries(
    Object.entries(touchline).map(([key, value]) => [value.Symbol, value])
  );
  touchlineData = altObj;
}

function tickHandler(tick) {
  const tempTick = tick;
  tickData[tick.Symbol] = tempTick;
  // console.log(">>>>>>>>>>>>>", tickData);
}

function bidaskHandler(bidask) {
  console.log("bidask>>>");
  console.log(bidask);
}

function barHandler(bar) {
  console.log("bar>>>");
  console.log(bar);
}

// FOR CLIENT WS
wss.on("connection", (ws) => {
  var receivedSymbol;
  ws.on("message", (message) => {
    const msg = JSON.parse(message);
    receivedSymbol = msg.symbol;
    console.log(`Received message => ${message}`);
  });

  var interval = setInterval(function () {
    data = "Real-Time Update " + number;

    // console.log("SENT: " + data);
    // const sendData = touchlineData[receivedSymbol];
    for (const symbol of receivedSymbol) {
      const sendData = tickData[symbol];
      ws.send(JSON.stringify(sendData));
    }

    number++;
  }, 1000);

  ws.on("close", function close() {
    clearInterval(interval);
  });
});

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
