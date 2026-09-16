export type ApplicationErrorCode = 'UNKNOWN_DOMAIN' | 'DOMAIN_NOT_AVAILABLE' | 'CAPABILITY_NOT_AVAILABLE' | 'INVALID_DOMAIN_REQUEST';
export interface ApplicationErrorDetails {
    domain?: string;
    intent?: string;
}
export declare class ApplicationError extends Error {
    readonly code: ApplicationErrorCode;
    readonly details: Readonly<ApplicationErrorDetails>;
    readonly name = "ApplicationError";
    constructor(code: ApplicationErrorCode, message: string, details?: Readonly<ApplicationErrorDetails>);
}
//# sourceMappingURL=errors.d.ts.map