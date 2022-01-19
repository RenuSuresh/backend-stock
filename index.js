const express = require("express");
const app = express();
app.get("/", (req, res) => {});

const { tour1 } = require("./constant");

for (const userandTournament of tour1.userTournaments) {
  userandTournament["score"] = userandTournament.availableCredits;
  const order = userandTournament.userOrders;
  delete userandTournament.userOrders;
  for (const userOrder of order) {
    let cal = userOrder.quantity;
    userandTournament["score"] += cal;
  }
}
