import dhtSensor from "node-dht-sensor";

const CONFIG = {
  pin: 4,
};

async function exec() {
  try {
    const res = await dhtSensor.promises.read(22, CONFIG.pin);
    console.log({
      temperature: res.temperature.toFixed(1),
      humidity: res.humidity.toFixed(1),
    });
  } catch (err) {
    console.error("Failed to read sensor data:", err);
  }
}

export function sensor() {
  setInterval(function () {
    exec();
  }, 1000);
}
