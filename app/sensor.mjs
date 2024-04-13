import dhtSensor from "node-dht-sensor";
import { DB } from "./db.mjs";

const CONFIG = {
  pin: 4,
  intervalMin: 20,
};

async function exec() {
  try {
    const res = await dhtSensor.promises.read(22, CONFIG.pin);
    DB.add({
      temperature: res.temperature.toFixed(1),
      humidity: res.humidity.toFixed(1),
    });
    console.log("add sensor data");
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

export function sensor() {
  setInterval(function () {
    exec();
  }, CONFIG.intervalMin * 60 * 1000);
}
