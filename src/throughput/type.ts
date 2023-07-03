export type GroupFn = (data: StoryData[]) => Record<string, StoryData[]>;

export type StoryData = {
  completedAt: Date;
  id: string;
};

export interface StoryDataList {
  stories: StoryData[];
  count: (fn: GroupFn) => ThroughputData[];
}

export type ThroughputData = {
  periodEnd: Date;
  total: number;
};
