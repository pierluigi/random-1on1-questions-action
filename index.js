const fs = require("fs");
const groupBy = require("lodash/groupBy");
const each = require("lodash/each");
const random = require("lodash/random");
const chalk = require("chalk");
const core = require("@actions/core");
const github = require("@actions/github");

const qFile = "./questions.json";
const log = console.log;

function generateQuestions(numQuestions) {
  var q;
  var q = JSON.parse(fs.readFileSync(qFile, "utf8"));

  const qByCategory = groupBy(q, q => q.category);
  let response = `
# Random 1 on 1 Questions
  
👋🏻 Hiya! This is a randomly picked selection of 1on1 questions, dived by category. Feel free to use whatever is most relevant and only if it makese sense!
  
`;
  each(qByCategory, (el, k) => {
    let qIndices = [];
    while (qIndices.length < numQuestions) {
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

  return response;
}

try {
  const numQuestions = parseInt(core.getInput("num-questions"));
  log(`Hello ${numQuestions}!`);
  core.setOutput("response", generateQuestions(numQuestions));
} catch (error) {
  core.setFailed(error.message);
}
