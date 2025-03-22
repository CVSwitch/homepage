export function extractText(html: string) {
    return html?.replace(/<[^>]*>/g, "").trim();
  }