import { Nothing } from "purify-ts";
import typia from "typia";
import {
  MinimumIssue,
  inputDataFrom,
  startAndEndDateFor,
} from "./jira_gateway";

describe("jira-gateway", () => {
  describe("issue to input data", () => {
    describe("finished issue", () => {
      const issue = {
        id: "b17",
        key: "B1-7",
        fields: {
          summary: "Allow logout",
        },
        changelog: {
          histories: [
            {
              created: "2023-07-04T14:36:41.198+0000",
              items: [
                {
                  field: "status",
                  fieldtype: "jira",
                  fieldId: "status",
                  from: "10000",
                  fromString: "Backlog",
                  to: "3",
                  toString: "In Progress",
                },
              ],
            },
            {
              created: "2023-07-05T14:36:41.198+0000",
              items: [
                {
                  field: "status",
                  fieldtype: "jira",
                  fieldId: "status",
                  from: "10000",
                  fromString: "Backlog",
                  to: "3",
                  toString: "In Progress",
                },
              ],
            },
            {
              created: "2023-07-08T17:20:19.489+0000",
              items: [
                {
                  field: "status",
                  fieldtype: "jira",
                  fieldId: "status",
                  from: "3",
                  to: "10002",
                  fromString: "In Prgress",
                  toString: "Done",
                },
              ],
            },
          ],
        },
      };

      it("returns first seen (eariest) start and end date", () => {
        const startEndDate = startAndEndDateFor(issue.changelog.histories);

        expect(startEndDate.extract()).toEqual({
          startDate: "2023-07-04T14:36:41.198+0000",
          endDate: "2023-07-08T17:20:19.489+0000",
        });
      });

      it("returns input data for finished issues", () => {
        const inputData = inputDataFrom(typia.assert<MinimumIssue>(issue));

        expect(inputData.extract()).toEqual({
          id: "B1-7",
          startDate: "2023-07-04T14:36:41.198+0000",
          endDate: "2023-07-08T17:20:19.489+0000",
          feature: "",
        });
      });
    });

    describe("unfinished issue", () => {
      const unfinishedIssue = {
        id: "b17",
        key: "B1-7",
        fields: {
          summary: "Allow logout",
        },
        changelog: {
          histories: [
            {
              created: "2023-07-04T14:36:41.198+0000",
              items: [
                {
                  field: "status",
                  fieldtype: "jira",
                  fieldId: "status",
                  from: "10000",
                  fromString: "Backlog",
                  to: "3",
                  toString: "In Progress",
                },
              ],
            },
          ],
        },
      };

      it("returns nothing when not finished", () => {
        expect(startAndEndDateFor(unfinishedIssue.changelog.histories)).toBe(
          Nothing,
        );
        expect(inputDataFrom(unfinishedIssue)).toBe(Nothing);
      });

      it("accepts issues with transitions other than state", () => {
        const unfinishedIssueWithNonStatusChange = {
          ...unfinishedIssue,
          changelog: {
            histories: [
              ...unfinishedIssue.changelog.histories,
              {
                created: "2023-07-04T14:33:11.178+0000",
                items: [
                  {
                    field: "IssueParentAssociation",
                    fieldtype: "jira",
                    from: null,
                    fromString: null,
                    to: "10000",
                    toString: "B1-1",
                  },
                ],
              },
            ],
          },
        };

        expect(() =>
          typia.assert<MinimumIssue>(unfinishedIssueWithNonStatusChange),
        ).not.toThrow();
      });
    });
  });
});
