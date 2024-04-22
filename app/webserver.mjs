import express, { json } from "express";
import { DB } from "./db.mjs";

export function webserver() {
  const app = express();
  app.use(json());

  const PORT = process.env.PORT || 3000;

  app.get("/day", async (req, res) => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() - 1);
    const data = await DB.getMultiple(date.getTime());
    res.json(data);
  });

  app.get("/month", async (req, res) => {
    const date = new Date(Date.now());
    date.setMonth(date.getMonth() - 1);
    const data = await DB.getMultiple(date.getTime());
    res.json(data);
  });

  app.get("/year", async (req, res) => {
    const date = new Date(Date.now());
    date.setFullYear(date.setFullYear() - 1);
    const data = await DB.getMultiple(date.getTime());
    res.json(data);
  });

  // TODO: add admin page

  app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
}
