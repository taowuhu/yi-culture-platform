export interface EvidenceItem {
  evidenceId: string;
  chunkId?: string;
  sourceId: string;
  documentId: string;
  work: string;
  section: string;
  chapter: string;
  text: string;
}

export interface EvidencePack {
  schemaVersion: 1;
  domain: string;
  evidence: EvidenceItem[];
  status: 'available' | 'insufficient';
}

export interface Citation {
  sourceId: string;
  work: string;
  section?: string;
  url?: string;
  textSnippet: string;
}

export interface Provenance {
  engineVerified: boolean;
  evidenceStatus: EvidencePack['status'];
  citations: Citation[];
}

export interface GroundedAnswer {
  explanation: string;
  citations: Citation[];
  refusal?: string;
  insufficientEvidence?: boolean;
}

export interface AnalysisContext {
  engineResult: { hexagramName: string; index: number; movingLines: number[]; benGua: { name: string }; bianGua?: { name: string } };
  evidence: EvidencePack;
  userQuestion?: string;
}
