# Team Metrics

[![Build, Test, Deploy](https://github.com/jessicamann/team-metrics/actions/workflows/deploy.yaml/badge.svg)](https://github.com/jessicamann/team-metrics/actions/workflows/deploy.yaml)
[![CodeFactor](https://www.codefactor.io/repository/github/jessicamann/team-metrics/badge)](https://www.codefactor.io/repository/github/jessicamann/team-metrics)
[![Known Vulnerabilities](https://snyk.io/test/github/jessicamann/team-metrics/badge.svg)](https://snyk.io/test/github/jessicamann/team-metrics)

Powerful metrics to lend insights into your team's value delivery process.

```zsh
npm ci && npm run build && npm run start
```

🚀 Then go on ahead to `http://localhost:3000`

## Uplaoding a file

The file format expects a csv file with the following headers:

- `id`: the identifier of the story
- `startDate`: the date the story entered the "in progress" stage
- `endDate`: the date the story entered the "done" stage
- `feature`: the feature or epic for the story (optional)

| id      | startDate  | endDate    | feature         |
| ------- | ---------- | ---------- | --------------- |
| STORY-1 | 2022-01-25 | 2022-01-31 | 1-click signup  |
| STORY-1 | 2022-03-25 | 2022-04-02 | Another Feature |

# up next

- (quality) missing tests...
- deploy
- import from jira...?
- data store
- share with others
