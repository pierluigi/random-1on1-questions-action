const fs = require("fs");
const utils = require("./utils");

const payload = JSON.parse(fs.readFileSync("./payload.json", "utf8"));
const log = console.log;

log(payload.issue.labels.find((l) => l.name == "1"));
// console.log(utils.generateQuestions(2, 2));
