export type CycleTime = {
  id: string;
  completedAt: Date;
  cycletime: number;
};

type ConfidenceLine = {
  label: string;
  data: { x: number; y: number }[];
  borderColor: string;
  borderWidth: number;
  pointRadius: 0;
  pointHoverRadius: 0;
  fill: false;
  tension: 0;
  showLine: true;
};
