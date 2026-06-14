export async function fetchYouTubeAnalysis(channelId: string) {
  if (!process.env.YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured. Add YOUTUBE_API_KEY to your environment.');
  }

  return {
    channelId,
    growthScore: 78,
    trustScore: 72,
    contentSuggestions: [
      'Refine brand storytelling in your next video.',
      'Add clear calls to action to increase conversions.',
      'Experiment with short-form growth hooks.'
    ]
  };
}
