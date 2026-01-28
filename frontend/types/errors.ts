// ✅ Common error types for API responses
export interface ApiErrorData {
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  status: number;
  data: ApiErrorData;
}

export interface ApiRequestError {
  request: unknown;
  response?: never;
}

export interface ApiResponseError {
  response: ApiErrorResponse;
  request?: unknown;
}

export type ApiErrorInstance = ApiResponseError | ApiRequestError | Error;

// ✅ Type guard functions
export function isApiResponseError(error: unknown): error is ApiResponseError {
  return typeof error === 'object' && error !== null && 'response' in error &&
    typeof (error as ApiResponseError).response === 'object' &&
    'status' in (error as ApiResponseError).response;
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return typeof error === 'object' && error !== null && 'request' in error &&
    !('response' in error);
}