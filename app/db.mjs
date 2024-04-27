import { Level } from "level";
import { join } from "path";

let db;

export const DB = {
  init: () => {
    db = new Level(join(import.meta.dirname, "../db"), {
      valueEncoding: "json",
    });
  },

  add: async (value) => {
    await db.put(Date.now(), value);
  },
  getOne: async (date) => {
    return await db.get(date);
  },
  getLast: async () => {
    const lastKey = (await db.keys({ limit: 1, reverse: true }).all()).reduce(
      (v) => v
    );
    const data = await DB.getOne(Number.parseInt(lastKey));
    data.time = lastKey;
    return data;
  },
  getMultiple: async (minDate = false, maxDate = false) => {
    const data = [];
    const opts = {};
    if (minDate) opts.gt = minDate;
    if (maxDate) opts.lt = maxDate;

    for await (let [key, value] of db.iterator(opts)) {
      data.push({
        ...value,
        time: key,
      });
    }
    return data;
  },
  removeAll: async () => {
    await db.clear();
  },
};
