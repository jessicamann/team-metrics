export type DurationFn = (data: StoryData[]) => Record<string, StoryData[]>;

export type StoryData = {
  completedAt: Date;
  id: string;
};

export interface StoryDataList {
  stories: StoryData[];
  count: (fn: DurationFn) => ThroughputData[];
}

export type ThroughputData = {
  periodEnd: Date;
  total: number;
};
