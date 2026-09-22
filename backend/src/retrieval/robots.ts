import robotsParser from 'robots-parser';
import { fetchUrl } from './fetcher';

export const checkRobotsTxt = async (urlStr: string): Promise<boolean> => {
  try {
    const url = new URL(urlStr);
    const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
    const robotsTxt = await fetchUrl(robotsUrl);
    
    if (!robotsTxt) return true;
    
    const robots = robotsParser(robotsUrl, robotsTxt);
    const isAllowed = robots.isAllowed(urlStr, 'AI-Interview-Prep-Kit/1.0');
    return isAllowed ?? true;
  } catch (e) {
    return true;
  }
};
