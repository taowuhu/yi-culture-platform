export function getProviderAdapter() {
  const key = process.env.BAILIAN_API_KEY || process.env.OPENAI_API_KEY || process.env.ZHIPU_API_KEY;
  return key ? '{configured}' : '{not-configured}';
}
