import * as cheerio from 'cheerio';

export const parseHtml = (html: string, baseUrl: string) => {
  const $ = cheerio.load(html);
  
  // Extract text
  $('script, style, noscript, iframe').remove();
  const text = $('body').text().replace(/\s+/g, ' ').trim();
  
  // Extract links
  const links = new Set<string>();
  $('a').each((i, link) => {
    const href = $(link).attr('href');
    if (href) {
      try {
        const urlObj = new URL(href, baseUrl);
        if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
          links.add(urlObj.href);
        }
      } catch (e) {
        // invalid URL
      }
    }
  });

  return { text, links: Array.from(links) };
};
