export const DOMAIN_IDS = [
  'iching',
  'bazi',
  'ziwei',
  'liuyao',
  'meihua',
  'qimen',
] as const;

export type DomainId = (typeof DOMAIN_IDS)[number];

export type DomainStatus = 'available' | 'planned';

export interface DomainCapabilities {
  calculation: boolean;
  derivedAnalysis: boolean;
  structuredKnowledge: boolean;
  retrieval: boolean;
  explanation: boolean;
}

export interface DomainDescriptor {
  id: DomainId;
  displayName: string;
  description: string;
  status: DomainStatus;
  capabilities: Readonly<DomainCapabilities>;
}

export interface DomainModule<
  TInput = unknown,
  TEngineResult = unknown,
  TDerivedAnalysis = undefined,
> {
  descriptor: DomainDescriptor;
  calculate?: (input: TInput) => TEngineResult;
  analyze?: (result: TEngineResult) => TDerivedAnalysis;
}

export function isDomainId(value: unknown): value is DomainId {
  return (
    typeof value === 'string' &&
    (DOMAIN_IDS as readonly string[]).includes(value)
  );
}
