import { DB } from "./app/db.mjs";
import { sensor } from "./app/sensor.mjs";
import { webserver } from "./app/webserver.mjs";

async function main() {
  DB.init();
  sensor();
  webserver();
}
main();
