import express, { json } from "express";
import { join } from "path";
import { DB } from "./db.mjs";
import cors from "cors";

export function webserver() {
  const app = express();
  app.use(cors());
  app.use(json());
  app.use(express.static("public"));
  app.use(
    "/chart.js",
    express.static(join(import.meta.dirname, "../node_modules/chart.js"))
  );

  const PORT = process.env.PORT || 3000;

  app.get("/active", async (req, res) => {
    const data = await DB.getLast();
    res.json(data);
  });

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

  app.listen(PORT, () =>
    console.log(new Date(), `App listening at port ${PORT}`)
  );
}
