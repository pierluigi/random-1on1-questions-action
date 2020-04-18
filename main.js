const fs = require("fs"),
  _ = require("lodash"),
  core = require("@actions/core"),
  github = require("@actions/github");

const qFile = "./questions.json";
const groupBy = _.curryRight(_.groupBy);
const groupByCategory = groupBy((q) => q.category);

function generateQuestions(numCategories, numQuestions) {
  var q = JSON.parse(fs.readFileSync(qFile, "utf8"));
  const qByCategory = groupByCategory(q);
  let response = `# Random 1 on 1 Questions
  
👋🏻 Hiya! This is a randomly picked selection of 1 on 1 questions (from a total of ${q.length}), dived by category. Feel free to use whatever is most relevant and only if it makese sense!`;

  const flattened = _.flatten(_.sampleSize(qByCategory, numCategories));
  const randomCategories = groupByCategory(flattened);
  const qs = _.reduce(
    randomCategories,
    function (memo, curr) {
      const rq = _.sampleSize(curr, numQuestions);
      return _.concat(memo, rq);
    },
    []
  );

  _.reduce(
    groupByCategory(qs),
    (memo, q, c) => {
      let r = memo + `\n\n## ${c}\n`;
      r += q.map((curr) => `- ${curr.question}`).join(`\n`);
      response += r;
    },
    ""
  );

  return response;
}

async function run() {
  try {
    const numCategories = parseInt(core.getInput("num-categories"), 10);
    const numQuestions = parseInt(core.getInput("num-questions"), 10);
    const body = generateQuestions(numCategories, numQuestions);
    core.info(body);

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
      body,
    });

    core.debug(JSON.stringify(commentResponse.data));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
