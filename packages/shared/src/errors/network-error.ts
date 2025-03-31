export interface NetworkError<T = unknown> extends Error {
  response?: {
    statusCode: number;
    body?: T;
  };
  code?: string;
}
