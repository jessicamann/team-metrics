# Team Metrics

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
