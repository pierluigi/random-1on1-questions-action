const fs = require("fs"),
  _ = require("lodash"),
  groupBy = require("lodash/groupBy"),
  each = require("lodash/each"),
  random = require("lodash/random"),
  chalk = require("chalk"),
  core = require("@actions/core"),
  github = require("@actions/github");

const qFile = "./questions.json";
const log = console.log;

function generateQuestions(numCategories, numQuestions) {
  var q = JSON.parse(fs.readFileSync(qFile, "utf8"));
  const qByCategory = groupBy(q, (q) => q.category);
  let response = `
# Random 1 on 1 Questions
  
👋🏻 Hiya! This is a randomly picked selection of 1 on 1 questions (from a total of ${q.length}), dived by category. Feel free to use whatever is most relevant and only if it makese sense!
  
`;

  const flattened = _.flatten(_.sampleSize(qByCategory, numCategories));
  const randomCategories = groupBy(flattened, (q) => q.category);

  const questions = _.reduce(randomCategories, (prev, curr) => {
    //   prev.push(_.sampleSize(curr, numQuestions));
    log(prev);
  });

  log(questions);

  //   each(randomCategories, (c, k) => {
  //     const reflattened =_.sampleSize(c, numQuestions);
  //     log(reflattened);
  //     // log(flattened);
  //     // log(_.sampleSize(c, numQuestions));
  //     //     let qIndices = [];
  //     //     while (qIndices.length < numQuestions) {
  //     //       // qIndices = uniq(qIndices, [random(el.length - 1)]);
  //     //       const r = random(el.length - 1);
  //     //       if (qIndices.indexOf(r) < 0) qIndices.push(r);
  //     //     }

  //     let questions = "";
  //     //     qIndices.forEach((id) => {
  //     //       questions += `- ${el[id].question}
  //     // `;
  //     //     });

  //     response += `
  // ## ${chalk.bold(k)}
  // ${questions}
  // `;
  //   });

  return response;
}

const body = generateQuestions(2, 2);
// console.log(body);
