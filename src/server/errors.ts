export interface ProblemResponse {
  type: string;
  title: string;
  status: number;
}

export interface ValidationProblemResponse extends ProblemResponse {
  invalidParams: Array<{
    name: string;
    reason: string;
  }>;
}

export class ImportError extends Error {
  constructor(message: string, options: ErrorOptions = {}) {
    super(message, options);
    this.name = "import-fail";
  }
}
