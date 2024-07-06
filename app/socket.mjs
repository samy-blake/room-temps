import WebSocket from "ws";
import os from "os";
import { DB } from "./db.mjs";

const interactions = {
  active: async () => {
    return await DB.getLast();
  },
  day: async () => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() - 1);
    return await DB.getMultiple(date.getTime());
  },
  month: async () => {
    const date = new Date(Date.now());
    date.setMonth(date.getMonth() - 1);
    return await DB.getMultiple(date.getTime());
  },
  year: async () => {
    const date = new Date(Date.now());
    date.setFullYear(date.setFullYear() - 1);
    return await DB.getMultiple(date.getTime());
  },
};

export function socket() {
  const headers = {};
  headers[process.env.SOCKET_HEADER_NAME] = process.env.SOCKET_HEADER_VALUE;

  const connect = () => {
    console.log(new Date(), "ws connecting");
    const ws = new WebSocket(process.env.SOCKET_URL, {
      perMessageDeflate: false,
      host: os.hostname(),
      origin: os.hostname(),
      headers,
    });
    ws.on("error", console.error);

    ws.on("open", () => {
      // is connected
    });

    ws.on("message", async (data) => {
      let parsedData = null;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.log(e);
        return;
      }
      if (!parsedData.action) {
        console.log("no action defined");
        return;
      }
      if (Object.hasOwnProperty.call(interactions, parsedData.action)) {
        const data = await interactions[parsedData.action]();
        ws.send(JSON.stringify(data));
      } else {
        console.log("action", parsedData, "is not defined");
      }

      console.log("received: %s", data);
    });

    ws.on("close", () => {
      console.log(new Date(), "close ws connection...");
      setTimeout(() => connect(), 10000);
    });
  };
  connect();
}
