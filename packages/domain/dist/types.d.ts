export declare const DOMAIN_IDS: readonly ["iching", "bazi", "ziwei", "liuyao", "meihua", "qimen"];
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
export interface DomainModule<TInput = unknown, TEngineResult = unknown, TDerivedAnalysis = undefined> {
    descriptor: DomainDescriptor;
    calculate?: (input: TInput) => TEngineResult;
    analyze?: (result: TEngineResult) => TDerivedAnalysis;
}
export declare function isDomainId(value: unknown): value is DomainId;
//# sourceMappingURL=types.d.ts.map