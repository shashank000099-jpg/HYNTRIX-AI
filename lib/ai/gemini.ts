export async function generateGeminiInsight(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Add GEMINI_API_KEY to your environment.');
  }

  return {
    source: 'gemini',
    prompt,
    summary: `Gemini placeholder analysis for: ${prompt}`,
    insights: [
      'Market fit signal appears strong.',
      'Positioning needs sharper differentiation.',
      'Recommended next step: validate customer demand with a small cohort.'
    ]
  };
}
