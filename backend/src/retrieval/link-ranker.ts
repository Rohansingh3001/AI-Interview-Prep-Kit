export const rankLinks = (links: string[], baseUrl: string): string[] => {
  const keywords = ['career', 'job', 'hiring', 'about', 'team', 'interview', 'culture', 'engineering', 'tech'];
  
  return links
    .filter(link => {
      try {
        const u = new URL(link);
        const b = new URL(baseUrl);
        return u.hostname === b.hostname || u.hostname.endsWith(b.hostname);
      } catch (e) {
        return false;
      }
    })
    .map(link => {
      let score = 0;
      const lowerLink = link.toLowerCase();
      for (const kw of keywords) {
        if (lowerLink.includes(kw)) score += 10;
      }
      return { link, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(l => l.link)
    .slice(0, 10); // top 10 promising links
};
