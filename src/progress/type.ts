export type Feature = string;

export type StoryData = {
  feature: Feature;
  status: "Done" | "In progress" | "Not started";
};

export type Options = {
  only?: Feature | Feature[];
};
