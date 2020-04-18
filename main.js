const _ = require("lodash"),
  core = require("@actions/core"),
  github = require("@actions/github");
const utils = require("./utils");

async function run() {
  try {
    const numCategories = parseInt(core.getInput("num-categories"), 10);
    const numQuestions = parseInt(core.getInput("num-questions"), 10);
    const body = utils.generateQuestions(numCategories, numQuestions);
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
