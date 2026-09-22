import { fetchUrl } from '../retrieval/fetcher';
import { parseHtml } from '../retrieval/parser';
import { rankLinks } from '../retrieval/link-ranker';
import { checkRobotsTxt } from '../retrieval/robots';

export const crawlCompany = async (companyUrl: string, maxPages = 5) => {
  const visited = new Set<string>();
  const toVisit = [companyUrl];
  const pagesData: { url: string; text: string }[] = [];

  while (toVisit.length > 0 && pagesData.length < maxPages) {
    const currentUrl = toVisit.shift()!;
    if (visited.has(currentUrl)) continue;
    visited.add(currentUrl);

    const isAllowed = await checkRobotsTxt(currentUrl);
    if (!isAllowed) continue;

    const html = await fetchUrl(currentUrl);
    if (!html) continue;

    const { text, links } = parseHtml(html, currentUrl);
    pagesData.push({ url: currentUrl, text });

    const rankedLinks = rankLinks(links, companyUrl);
    for (const link of rankedLinks) {
      if (!visited.has(link)) {
        toVisit.push(link);
      }
    }
  }

  return pagesData;
};
