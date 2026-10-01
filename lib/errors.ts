export const ERROR_CODES = {
  CONSENT_REQUIRED: 'CONSENT_REQUIRED',
  INVALID_FILE: 'INVALID_FILE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_URL: 'INVALID_URL',
  SSRF_BLOCKED: 'SSRF_BLOCKED',
  DRESS_IMAGE_NOT_FOUND: 'DRESS_IMAGE_NOT_FOUND',
  TRYON_FAILED: 'TRYON_FAILED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

export interface ApiError {
  code: ErrorCode;
  message: string;
}

export function createErrorResponse(code: ErrorCode, message: string, status = 400) {
  return Response.json({ data: null, error: { code, message } }, { status });
}
