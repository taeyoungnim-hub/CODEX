export async function fetchHtml(url: string, timeoutMs = 6000): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': process.env.CRAWLER_USER_AGENT ?? 'AllReviewsHubBot/0.1'
      }
    });

    if (!response.ok) throw new Error(`Fetch failed with status ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

export function extractReadableText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
