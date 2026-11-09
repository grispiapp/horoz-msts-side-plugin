/**
 * Generic API Response Types
 */

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
}

export interface ApiErrorResponse {
  statusCode: number;
  data: {
    error: {
      description: string;
      type: string;
    };
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// Type guard to check if response is an error
export function isApiError(
  response: ApiResult<any>
): response is ApiErrorResponse {
  const isInOkRange = response.statusCode >= 200 && response.statusCode < 300;
  const isError = "error" in response.data;

  return isError && !isInOkRange;
}
