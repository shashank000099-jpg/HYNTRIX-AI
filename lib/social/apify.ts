export async function fetchApifyTaskStatus(taskId: string) {
  if (!process.env.APIFY_API_KEY) {
    throw new Error('Apify API key is not configured. Add APIFY_API_KEY to your environment.');
  }

  return {
    taskId,
    status: 'ready',
    description: 'Placeholder task status from Apify integration.',
    lastRun: new Date().toISOString()
  };
}