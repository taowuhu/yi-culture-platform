import express from 'express';
import { AnalysisContext, GroundedAnswer } from '../../packages/knowledge-contracts/src/types';

const router = express.Router();

function getProviderKey(): string | undefined {
  return process.env.BAILIAN_API_KEY || process.env.OPENAI_API_KEY || process.env.ZHIPU_API_KEY;
}

router.post('/explain', async (req, res) => {
  const key = getProviderKey();
  const ctx: AnalysisContext = req.body;

  if (!key) {
    res.json({
      explanation: 'AI 解读当前未配置',
      citations: [],
      insufficientEvidence: true,
      refusal: '服务端 AI 提供商未配置 API Key。原典内容与周易计算仍可正常使用。',
    } as GroundedAnswer);
    return;
  }

  const benName = ctx.engineResult?.hexagramName || '未知卦';
  const evidence = ctx.evidence?.evidence || [];
  const citations = evidence.map((e) => ({
    sourceId: e.sourceId,
    work: e.work,
    textSnippet: e.text.slice(0, 120),
  }));

  res.json({
    explanation: `本卦为${benName}。根据现有原典依据与卦象计算，${evidence.length > 0 ? '可结合经典文本参考理解' : '暂无足够证据支撑更深入解读'}。`,
    citations,
    insufficientEvidence: evidence.length === 0,
  } as GroundedAnswer);
});

export default router;
