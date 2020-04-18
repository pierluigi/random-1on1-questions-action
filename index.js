const fs = require("fs"),
  groupBy = require("lodash/groupBy"),
  each = require("lodash/each"),
  random = require("lodash/random"),
  chalk = require("chalk"),
  core = require("@actions/core"),
  github = require("@actions/github");

const qFile = "./questions.json";

// TODO
// - fetch questions from original repo

function generateQuestions(numQuestions) {
  var q;
  var q = JSON.parse(fs.readFileSync(qFile, "utf8"));

  const qByCategory = groupBy(q, (q) => q.category);
  let response = `
# Random 1 on 1 Questions
  
👋🏻 Hiya! This is a randomly picked selection of 1 on 1 questions (from a total of ${q.length}), dived by category. Feel free to use whatever is most relevant and only if it makese sense!
  
`;
  each(qByCategory, (el, k) => {
    let qIndices = [];
    while (qIndices.length < numQuestions) {
      // qIndices = uniq(qIndices, [random(el.length - 1)]);
      const r = random(el.length - 1);
      if (qIndices.indexOf(r) < 0) qIndices.push(r);
    }

    let questions = "";
    qIndices.forEach((id) => {
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

async function run() {
  try {
    const numQuestions = parseInt(core.getInput("num-questions"));
    const response = generateQuestions(numQuestions);
    core.setOutput("response", response);
    core.info(response);

    const token = core.getInput("github-token", { required: true }),
      context = github.context,
      issue_number = context.issue.number,
      owner = context.repo.owner,
      repo = context.repo.repo,
      client = new github.GitHub(token);

    const commentResponse = await client.issues.createComment({
      issue_number,
      repo,
      owner,
      body: response,
    });

    core.debug(JSON.stringify(commentResponse.data));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
