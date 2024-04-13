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
