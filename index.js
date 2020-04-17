const fs = require("fs");
const groupBy = require("lodash/groupBy");
const each = require("lodash/each");
const random = require("lodash/random");
const chalk = require("chalk");
const core = require("@actions/core");
const github = require("@actions/github");

const NUM_Q_PER_CATEGORY = 1;

const qFile = "./questions.json";

const log = console.log;
var q;
var q = JSON.parse(fs.readFileSync(qFile, "utf8"));

const qByCategory = groupBy(q, q => q.category);
let response = `
# Random 1 on 1 Questions

👋🏻 Hiya! This is a randomly picked selection of 1on1 questions, dived by category. Feel free to use whatever is most relevant and only if it makese sense!

`;
each(qByCategory, (el, k) => {
  let qIndices = [];
  while (qIndices.length < NUM_Q_PER_CATEGORY) {
    // qIndices = uniq(qIndices, [random(el.length - 1)]);
    const r = random(el.length - 1);
    if (qIndices.indexOf(r) < 0) qIndices.push(r);
  }

  let questions = "";
  qIndices.forEach(id => {
    questions += `- ${el[id].question}
    `;
  });

  response += `
## ${chalk.bold(k)}
${questions}
`;
});

try {
  // `who-to-greet` input defined in action metadata file
  const numQuestions = parseInt(core.getInput("num-questions"));
  log(`Hello ${numQuestions}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
  core.setOutput("response", response);
} catch (error) {
  core.setFailed(error.message);
}
