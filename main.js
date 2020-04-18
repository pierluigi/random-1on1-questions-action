const _ = require("lodash"),
  core = require("@actions/core"),
  github = require("@actions/github");
const utils = require("./utils");

async function run() {
  try {
    const token = core.getInput("github-token", { required: true }),
      label = core.getInput("label"),
      numQuestions = parseInt(core.getInput("num-questions"), 10),
      numCategories = parseInt(core.getInput("num-categories"), 10),
      context = github.context,
      issue = context.payload.issue,
      issue_number = context.issue.number,
      owner = context.repo.owner,
      repo = context.repo.repo,
      client = new github.GitHub(token);
    if (issue.labels.find((l) => l.name == label)) {
      const body = utils.generateQuestions(numCategories, numQuestions);
      core.info(body);

      const commentResponse = await client.issues.createComment({
        issue_number,
        repo,
        owner,
        body,
      });

      core.debug(JSON.stringify(commentResponse.data));
    } else {
      core.setFailed("Label not present: " + label);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
