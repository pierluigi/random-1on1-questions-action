# Random 1 on 1 Question Generator

This action posts a comment with a list of randomly selected 1-on-1 questions when a new issue matches a specific label.

Questions are taken from https://github.com/VGraupera/1on1-questions (for now, copied inside this repo).

![Screenshot](screenshot.png?raw=true "Script in action")

## Instructions

Define a workflow like this:

```
on:
  issues:
    types: [opened]
jobs:
  questions:
    runs-on: ubuntu-latest
    name: Generate random questions
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Generate questions
        uses: pierluigi/random-1on1-questions-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # Optional: ovverride these defaults
          # num-categories: "3" # how many question categories
          # num-questions: "1" # how many questions per category
          # label: "1on1" # which label triggers this workflow

```

It's possible to define the number of categories and the amount of question per each category (see workflow defined above).

## How it works

This action is designed to run each time a new issue is opened (unfortunately at the time of writing it's not possible to conditionally skip an entire job based on issues having a label defined dynamically).

If the issue contains the specified label (checked during execution, by default `inputs.label = "1on1"`) the action will generate a number of questions (divided by category) and post them as a comment to the issue.

## Example

This repo is already set up to contain an example workflow and issue template (both inside the `.github` folder) that can be reused. To see it in action, simply [open a `One to one` issue](https://github.com/pierluigi/random-1on1-questions-action/issues/new/choose)!
