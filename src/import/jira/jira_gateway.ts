import { InputData } from "@app/common/repository";
import { groupBy } from "lodash";
import { Maybe, Nothing } from "purify-ts";

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

export function startAndEndDateFor(
  changelog: Array<MinimumChangelog>,
): Maybe<StartEndDate> {
  const statusChanges = changelog.reduce((acc, change) => {
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

  const changesByTransition = groupBy(
    statusChanges,
    (t) => `${t.fromString || ""}_${t.toString}`,
  );

  const uniqueStatusTransitions = Object.entries(changesByTransition).map(
    ([_key, changes]) => {
      const [newest, ..._rest] = [...changes].sort(sortByDate);
      return newest;
    },
  );

  const start = uniqueStatusTransitions.find(
    (t) => lowerStringOf(t.toString) === "in progress",
  );
  const end = uniqueStatusTransitions.find(
    (t) => lowerStringOf(t.toString) === "done",
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
