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
      issueNumberInput = parseInt(core.getInput("issue-number"), 10),
      context = github.context,
      owner = context.repo.owner,
      repo = context.repo.repo,
      client = new github.GitHub(token);

    let issue = _.get(context, "payload.issue"),
      issue_number = _.get(context, "issue.number");

    if ((!issue || !issue_number) && !isNaN(issueNumberInput)) {
      issue_number = issueNumberInput;
      console.log(issue_number);

      issue = await client.issues.get({
        issue_number,
        repo,
        owner,
      });
    } else {
      core.setFailed("No issue or issue number present");
    }

    console.log(issue);

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
