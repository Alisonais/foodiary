export enum ErrorCode {
  VALIDATION = 'VALIDATION',
  EMAIL_ALREADY_IN_USE = 'EMAIL_ALREADY_IN_USE',
  USER_NOT_FOUND_EXCEPTION = 'USER_NOT_FOUND_EXCEPTION',
  REFRESH_TOKEN_INVALID = 'REFRESH_TOKEN_INVALID',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',

  // HTTP

  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVE_ERROR',
  BAD_REQUEST = 'BAD_REQUEST'
}
