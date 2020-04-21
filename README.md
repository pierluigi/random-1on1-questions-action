# Random 1 on 1 Question Generator

This action posts a comment with a list of randomly selected 1-on-1 questions when a new issue matches a specific label.

Questions are taken from https://github.com/VGraupera/1on1-questions (for now, copied inside this repo).

![Screenshot](screenshot.png?raw=true "Script in action")

## Instructions

The following workflow will run each time a new issue is manually opened with a matching label:

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
        uses: pierluigi/random-1on1-questions-action@v1.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          # Optional: ovverride these defaults
          # num-categories: "3" # how many question categories
          # num-questions: "1" # how many questions per category
          # label: "1on1" # which label triggers this workflow

```

It's possible to define the number of categories and the amount of question per each category (see workflow defined above).

A more complete scenario is using the [issue-bot](https://github.com/imjohnbo/issue-bot) action to automatically create an issue based on a schedule:

```
name: Weekly one to one
on:
  schedule:
  - cron: 0 12 * * 7  # Every sunday at noon – https://crontab.guru     

jobs:
  weekly_meeting:
    name: create new issue
    runs-on: ubuntu-latest
    steps:
    - name: Set Date
      run: echo "::set-env name=DATE::$(date -u '+%B %d %Y')"


    # Repo code checkout required if `template` is used
    - name: Checkout
      uses: actions/checkout@v2
      
    - name: issue-bot
      id: issue-bot
      uses: imjohnbo/issue-bot@v2
      with:
        title: "1:1 for ${{ env.DATE }}"
        assignees: "pierluigi" # GitHub handles without the @
        labels: "1on1"
        pinned: true
        close-previous: true
        template: ".github/ISSUE_TEMPLATE/one-to-one.md" # assignees, labels will be overridden if present in YAML header
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    - name: Generate random questions
      if: success()
      uses: pierluigi/random-1on1-questions-action@v1.1
      with:
        issue-number: ${{ steps.issue-bot.outputs.issue-number }}
        github-token: ${{ secrets.GITHUB_TOKEN }}
        # Optional: ovverride these defaults
        # num-categories: "3" # how many question categories
        # num-questions: "1" # how many questions per category
        # label: "1on1" # which label triggers this workflow

```

Please note the added `issue-number` argument coming from the previous step's output. If this is specified, the action will fetch the issue details as these wouldn't be available to the running context (the event we're responding to is a `schedule`, so no issue is available yet).

## How it works

This action is designed to run each time a new issue is opened (unfortunately at the time of writing it's not possible to conditionally skip an entire job based on issues having a label defined dynamically).

If the issue contains the specified label (checked during execution, by default `inputs.label = "1on1"`) the action will generate a number of questions (divided by category) and post them as a comment to the issue.

## Example

This repo is already set up to contain an example workflow and issue template (both inside the `.github` folder) that can be reused. To see it in action, simply [open a `One to one` issue](https://github.com/pierluigi/random-1on1-questions-action/issues/new/choose)!
