import { Version3Client } from "jira.js";
import { Issue, SearchResults } from "jira.js/out/version3/models";

async function paginateThroughIssues(
  client: Version3Client,
  jql: string,
  { startAt = 0, maxResults = 100 },
  results: SearchResults = {},
): Promise<SearchResults> {
  return client.issueSearch
    .searchForIssuesUsingJqlPost({
      jql,
      expand: ["changelog"],
      fields: ["summary"],
      maxResults,
      startAt,
    })
    .then((response: SearchResults) => {
      const newResults = {
        ...results,
        issues: [...(results.issues || []), ...(response.issues || [])],
      };

      if ((response.total || 0) > newResults.issues?.length) {
        return paginateThroughIssues(
          client,
          jql,
          { startAt: newResults.issues?.length, maxResults },
          newResults,
        );
      }

      return newResults;
    });
}

export async function allIssues(
  client: Version3Client,
  jql: string,
  { startAt = 0, maxResults = 100 },
): Promise<Issue[]> {
  return paginateThroughIssues(client, jql, { startAt, maxResults }).then(
    (response) => response.issues || [],
  );
}
