import express, { json } from "express";
import { DB } from "./db.mjs";

function resetDate(date, min = true) {
  if (min) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
  } else {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
  }
}

export function webserver() {
  const app = express();
  app.use(json());

  const PORT = process.env.PORT || 3000;

  app.get("/get-today", async (req, res) => {
    const today = new Date(Date.now());
    resetDate(today);
    const data = await DB.getMultiple(today.getTime());
    res.json(data);
  });

  app.get("/get-active-month", async (req, res) => {
    const date = new Date();
    const monthMin = new Date(date.getFullYear(), date.getMonth(), 1);
    const monthMax = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    resetDate(monthMin);
    resetDate(monthMax);

    const data = await DB.getMultiple(monthMin.getTime(), monthMax.getTime());
    res.json(data);
  });

  // TODO: add admin

  app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
}
