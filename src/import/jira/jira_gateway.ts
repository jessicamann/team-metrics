import { InputData } from "@app/common/repository";
import { groupBy } from "lodash";
import { Maybe, Nothing } from "purify-ts";
import typia, { tags } from "typia";
import { allIssues } from "./issues";
import { Version3Client } from "jira.js";

export interface JiraRetrieval {
  host: string & tags.Format<"url">;
  email: string & tags.Format<"email">;
  token: string;
  jql: string;
  startStatus: string;
  finishStatus: string;
}

interface MinimumChangelog {
  created: string;
  items: Array<{
    fromString: string | null;
    toString: string;
    field: string;
  }>;
}

export interface MinimumIssue {
  key: string;
  changelog: {
    histories: Array<MinimumChangelog>;
  };
}

interface StartEndDate {
  startDate: string;
  endDate: string;
}

interface FlatItemChange {
  created: string;
  fromString: string;
  toString: string;
  field: string;
}

function lowerStringOf(value: string | undefined | null): string {
  return (value || "").toLowerCase().trim();
}

function sortByDate(a: FlatItemChange, b: FlatItemChange): number {
  return Date.parse(a.created) - Date.parse(b.created);
}

function statusChangesIn(
  changelog: Array<MinimumChangelog>,
): Array<FlatItemChange> {
  return changelog.reduce((acc, change) => {
    const statusChanges = change.items.filter(
      (item) => item.field === "status",
    );

    return [
      ...acc,
      ...statusChanges.map((statusChange) => ({
        created: change.created,
        fromString: statusChange.fromString!,
        toString: statusChange.toString,
        field: statusChange.field,
      })),
    ];
  }, new Array<FlatItemChange>());
}

export function startAndEndDateFor(
  changelog: Array<MinimumChangelog>,
  startingStatus = "in progress",
  finishStatus = "done",
): Maybe<StartEndDate> {
  const statusChanges = statusChangesIn(changelog);

  const changesByTransition = groupBy(
    statusChanges,
    (t) => `${t.fromString}_${t.toString}`,
  );

  const uniqueStatusTransitions = Object.entries(changesByTransition).map(
    ([_key, changes]) => {
      const [newest, ..._rest] = [...changes].sort(sortByDate);
      return newest;
    },
  );

  const start = uniqueStatusTransitions.find(
    (t) => lowerStringOf(t.toString) === startingStatus,
  );
  const end = uniqueStatusTransitions.find(
    (t) => lowerStringOf(t.toString) === finishStatus,
  );

  return start && end
    ? Maybe.of({ startDate: start.created, endDate: end.created })
    : Nothing;
}

export function inputDataFrom(issue: MinimumIssue): Maybe<InputData> {
  return startAndEndDateFor(issue.changelog.histories).map((dates) => {
    return {
      id: issue.key,
      startDate: dates.startDate,
      endDate: dates.endDate,
      feature: "",
    };
  });
}

export async function flowMetrics(
  jiraRetrieval: JiraRetrieval,
): Promise<Array<InputData>> {
  const issues = await allIssues(
    new Version3Client({
      host: jiraRetrieval.host,
      authentication: {
        basic: {
          email: jiraRetrieval.email,
          apiToken: jiraRetrieval.token,
        },
      },
    }),
    jiraRetrieval.jql,
    { maxResults: 150 },
  );

  const inputData = issues
    .map((issue) => Maybe.encase(() => typia.assert<MinimumIssue>(issue)))
    .reduce((acc, potentialIssue) => {
      return potentialIssue.caseOf({
        Just: (issue) => [...acc, inputDataFrom(issue)],
        Nothing: () => acc,
      });
    }, new Array<Maybe<InputData>>());

  return Maybe.catMaybes(inputData);
}
