export const StatusCodeUtil = {
  codes: {
    SUCCESS: 200,
    CREATED: 201,
    UNAUTHORIZED: 403,
    BAD_REQUEST: 400,
    BAD_ENTITY: 422,
    UNKNOWN_ERROR: 500
  },
  messages: {
    UNKNOWN_ERROR: 'Something went wrong',
    UNAUTHORIZED: 'We could not authorize you at this time. Please re-login and try again.',
    BAD_ENTITY: 'There was a problem with the given information. Please try again.'
  }
}