import type { DomainId } from './types';
export declare const APPLICATION_INTENTS: readonly ["calculate", "analyze", "knowledge", "explain"];
export type ApplicationIntent = (typeof APPLICATION_INTENTS)[number];
export interface ApplicationRequest<TPayload = unknown> {
    domain: DomainId;
    intent: ApplicationIntent;
    payload: TPayload;
}
export declare function isApplicationIntent(value: unknown): value is ApplicationIntent;
//# sourceMappingURL=application.d.ts.map