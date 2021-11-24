const express = require("express");
const {
  rtConnect,
  rtSubscribe,
  rtUnsubscribe,
  rtFeed,
  historical,
  formatTime,
} = require("truedata-nodejs");
const WebSocketServer = require("ws").Server;
const user = "tdws150";
const pwd = "shubham@150";
const portSocket = 8082;

const symbols = ["WIPRO", "INFY"];
const app = express();
const port = 3001;

const wss = new WebSocketServer({ port: 9060 });

app.get("/", (req, res) => {
  rtConnect(user, pwd, symbols, portSocket, (bidask = 1), (heartbeat = 1));
  rtFeed.on("touchline", touchlineHandler); // Receives Touchline Data
  rtFeed.on("tick", tickHandler); // Receives Tick data
  rtFeed.on("bidask", bidaskHandler); // Receives Bid Ask Data if enabled
  rtFeed.on("bar", barHandler); // Receives 1min and 5min bar data

  function touchlineHandler(touchline) {
    console.log("touchline>>>>>>");
    console.log(touchline);
  }

  function tickHandler(tick) {
    console.log("tick>>>");

    console.log(tick);
  }

  function bidaskHandler(bidask) {
    console.log("bidask>>>");

    console.log(bidask);
  }

  function barHandler(bar) {
    console.log("bar>>>");

    console.log(bar);
  }

  wss.on("connection", function (socketObj) {
    socketObject.on("message", function (message) {
      console.log(
        "The" +
          message +
          "Message Received from \n from IP " +
          socketObject.upgradeReq.connection.remoteAddress
      );
      socketObject.send("Received " + message);
    });
  });

  // var server = http.createServer(function (req, resp) {
  //   fs.readFile("../Pages/Client.html", function (error, pgResp) {
  //     if (error) {
  //       resp.writeHead(404);
  //       resp.write("Contents you are looking are Not Found");
  //     } else {
  //       resp.writeHead(200, { "Content-Type": "text/html" });
  //       resp.end(pgResp);
  //     }
  //   });
  // });

  // historical.auth(user, pwd); // For authentication

  // from = formatTime(2021, 3, 2, 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format
  // to = formatTime(2021, 3, 5, 9, 15); // (year, month, date, hour, minute) // hour in 24 hour format

  // historical
  //   .getBarData(
  //     "NIFTY-I",
  //     "210302T09:00:00",
  //     "210302T15:30:00",
  //     (interval = "1min"),
  //     (response = "json"),
  //     (getSymbolId = 0)
  //   )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));

  // historical
  //   .getBarData(
  //     "RELIANCE",
  //     from,
  //     to,
  //     (interval = "1min"),
  //     (response = "json"),
  //     (getSymbolId = 0)
  //   )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));

  // historical
  //   .getBarData(
  //     "NIFTY 50",
  //     (duration = "1W"),
  //     (interval = "60min"),
  //     (response = "json"),
  //     (getSymbolId = 0)
  //   )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));

  // historical
  //   .getTickData(
  //     "SBIN",
  //     "1D",
  //     (bidask = 1),
  //     (response = "csv"),
  //     (getSymbolId = 0)
  //   )
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));

  // historical
  //   .getLTP("L&TFH")
  //   .then((res) => console.log(res))
  //   .catch((err) => console.log(err));
  // const ws = new WebSocketServer({
  //   server: `wss://push.truedata.in:${port}?user=${user}&password=${pwd}`,
  //   path: "/stockpe",
  // });
  // console.log("ws>>>>>>>>>>>>>>>>>>>", ws);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
