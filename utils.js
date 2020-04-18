const fs = require("fs"),
  _ = require("lodash");

const groupBy = _.curryRight(_.groupBy);
const groupByCategory = groupBy((q) => q.category);
const qFile = "./questions.json";

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

  _.each(groupByCategory(qs), (q, c) => {
    let r = `\n\n## ${c}\n`;
    r += q.map((curr) => `- ${curr.question}`).join("\n");
    response += r;
  });

  return response;
}

exports.generateQuestions = generateQuestions;
