import Sentiment from 'sentiment';

const sentiment = new Sentiment();

function mapHuggingFaceResult(result) {
  if (!Array.isArray(result) || !result.length) {
    return null;
  }

  const sorted = [...result].sort((a, b) => b.score - a.score);
  const top = sorted[0];
  const label = String(top.label || 'neutral').toLowerCase();
  let score = top.score;

  if (label === 'negative') {
    score = -score;
  } else if (label === 'neutral') {
    score = 0;
  }

  return {
    provider: 'huggingface',
    score,
    label,
    raw: sorted,
  };
}

async function fetchHuggingFaceSentiment(text) {
  const key = process.env.HUGGINGFACE_API_KEY;
  const model = process.env.HUGGINGFACE_MODEL || 'distilbert-base-uncased-finetuned-sst-2-english';
  if (!key) return null;

  const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
  });

  if (!response.ok) {
    throw new Error(`Hugging Face request failed with status ${response.status}`);
  }

  const data = await response.json();
  return mapHuggingFaceResult(data);
}

export async function analyzeSentiment(text) {
  const local = sentiment.analyze(text);
  const fallback = {
    provider: 'local',
    score: local.score,
    comparative: local.comparative,
    label: local.score > 0 ? 'positive' : local.score < 0 ? 'negative' : 'neutral',
    positive: local.positive,
    negative: local.negative,
    tokens: local.tokens,
    words: local.words,
  };

  try {
    const aiResult = await fetchHuggingFaceSentiment(text);
    if (!aiResult) return fallback;

    return {
      ...fallback,
      provider: aiResult.provider,
      score: aiResult.score,
      label: aiResult.label,
      aiRaw: aiResult.raw,
    };
  } catch (_err) {
    return fallback;
  }
}
