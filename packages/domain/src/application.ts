import type { DomainId } from './types';

export const APPLICATION_INTENTS = [
  'calculate',
  'analyze',
  'knowledge',
  'explain',
] as const;

export type ApplicationIntent = (typeof APPLICATION_INTENTS)[number];

export interface ApplicationRequest<TPayload = unknown> {
  domain: DomainId;
  intent: ApplicationIntent;
  payload: TPayload;
}

export function isApplicationIntent(value: unknown): value is ApplicationIntent {
  return (
    typeof value === 'string' &&
    (APPLICATION_INTENTS as readonly string[]).includes(value)
  );
}
