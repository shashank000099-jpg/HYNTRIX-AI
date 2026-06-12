export async function generateOpenAIResponse(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Add OPENAI_API_KEY to your environment.');
  }

  return {
    source: 'openai',
    prompt,
    output: `OpenAI placeholder response for: ${prompt}`
  };
}
