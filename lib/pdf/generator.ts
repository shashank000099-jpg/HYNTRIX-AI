export interface ReportPayload {
  title: string;
  category: string;
  score: number;
  metrics: Record<string, number>;
  summary: string;
  recommendations: string[];
}

export async function generateReportPdf(payload: ReportPayload) {
  const document = `HYNTRIX AI Report\n\nTitle: ${payload.title}\nCategory: ${payload.category}\nOverall score: ${payload.score}\n\nSummary:\n${payload.summary}\n\nRecommendations:\n- ${payload.recommendations.join('\n- ')}\n`;
  return new TextEncoder().encode(document);
}
