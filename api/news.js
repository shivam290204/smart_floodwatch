export default async function handler(req, res) {
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const query = encodeURIComponent(
    "Delhi flood OR Delhi waterlogging OR monsoon"
  );

  const url =
    `https://newsapi.org/v2/everything?` +
    `q=${query}&language=en&sortBy=publishedAt&pageSize=10&` +
    `apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}
