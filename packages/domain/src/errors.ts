export type ApplicationErrorCode =
  | 'UNKNOWN_DOMAIN'
  | 'DOMAIN_NOT_AVAILABLE'
  | 'CAPABILITY_NOT_AVAILABLE'
  | 'INVALID_DOMAIN_REQUEST';

export interface ApplicationErrorDetails {
  domain?: string;
  intent?: string;
}

export class ApplicationError extends Error {
  readonly name = 'ApplicationError';

  constructor(
    readonly code: ApplicationErrorCode,
    message: string,
    readonly details: Readonly<ApplicationErrorDetails> = {},
  ) {
    super(message);
  }
}
