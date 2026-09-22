import axios from 'axios';

export const fetchUrl = async (url: string): Promise<string | null> => {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'AI-Interview-Prep-Kit/1.0',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch ${url}`);
    return null;
  }
};
