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
const schedule = require("node-schedule");
const axios = require("axios");
const { log } = require("console");
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
var tournamentData = {};
var tounamentsList = {};

for (const symbol of symbols) {
  tickData[symbol] = {};
}

rtConnect(user, pwd, symbols, portSocket, (bidask = 1), (heartbeat = 1));
rtFeed.on("touchline", touchlineHandler); // Receives Touchline Data
rtFeed.on("tick", tickHandler); // Receives Tick data

function touchlineHandler(touchline) {
  const altObj = Object.fromEntries(
    Object.entries(touchline).map(([key, value]) => [value.Symbol, value])
  );
  touchlineData = altObj;
}

function tickHandler(tick) {
  const tempTick = tick;
  tickData[tick.Symbol] = tempTick;
}

// function bidaskHandler(bidask) {
//   console.log("bidask>>>");
//   console.log(bidask);
// }

// function barHandler(bar) {
//   console.log("bar>>>");
//   console.log(bar);
// }

// FOR CLIENT WS
wss.on("connection", (ws, req) => {
  switch (req.url) {
    case "/marketdata":
      {
        var receivedSymbol = [];
        ws.on("message", (message) => {
          const msg = JSON.parse(message);
          receivedSymbol = msg.symbol;
        });

        var interval = setInterval(function () {
          for (const symbol of receivedSymbol) {
            const sendData =
              Object.keys(tickData[symbol]).length > 0
                ? tickData[symbol]
                : touchlineData[symbol];

            ws.send(JSON.stringify(sendData));
          }
        }, 1000);
      }
      break;

    case `/leaderboard`: {
      var receivedSlug;
      ws.on("message", (message) => {
        const msg = JSON.parse(message);
        receivedSlug = msg.tournamentSlug;
      });
      var interval = setInterval(function () {
        if (tounamentsList[receivedSlug]) {
          tounamentsList[receivedSlug].userTournaments.sort(function (a, b) {
            return b.score - a.score;
          });

          tounamentsList[receivedSlug].userTournaments = tounamentsList[
            receivedSlug
          ].userTournaments.slice(0, 20);
          ws.send(JSON.stringify(tounamentsList[receivedSlug]));
        }
      }, 1000);
      ws.on("close", function close() {
        clearInterval(interval);
      });
    }
  }
  ws.on("close", function close() {
    clearInterval(interval);
  });
});

const job = schedule.scheduleJob("*/1 * * * * *", function () {
  axios
    .get(
      "https://mvp.stockpe.in/api/v1/mvp/socket-data-provider/tournament-data"
    )
    .then((res) => {
      if (tickData) {
        tournamentData = res.data;

        const job1 = schedule.scheduleJob("*/1 * * * * *", function () {
          const altObj = Object.fromEntries(
            Object.entries(tournamentData).map(([key, value]) => [
              value.slug,
              value,
            ])
          );
          tounamentsList = altObj;

          for (const tour in tounamentsList) {
            for (const userandTournament of tounamentsList[tour]
              .userTournaments) {
              userandTournament["score"] = userandTournament.availableCredits;
              for (const userOrder of userandTournament.userOrders) {
                let cal = tickData[userOrder.scriptName].LTP
                  ? userOrder.quantity * tickData[userOrder.scriptName].LTP
                  : userOrder.quantity *
                    touchlineData[userOrder.scriptName].LTP;

                userandTournament["score"] += cal;
              }
            }
          }
        });
      }
    });
});

// websocket participants

// API send LTP of stocks
app.get("/get-ltp", function (req, res) {
  res.send(touchlineData);
});

server.listen(port, () => {
  console.log(`Stock Socket Application started with port:${port}`);
});
