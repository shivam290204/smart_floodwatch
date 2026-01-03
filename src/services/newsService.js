/**
 * News Service for Smart FloodWatch
 * Fetches flood-related news via backend API
 */

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

class NewsService {
  constructor() {
    this.cache = {
      data: null,
      timestamp: null
    };
    
    // Keywords for flood-related news filtering
    this.floodKeywords = [
      'flood', 'water-logging', 'monsoon', 'rainfall',
      'delhi flood', 'waterlogging', 'drainage',
      'imd alert', 'flood alert', 'heavy rain',
      'pwd', 'mcd', 'ddma', 'ndma', 'yamuna'
    ];
  }

  async fetchFloodNews() {
    // Check cache first
    if (this.cache.data && Date.now() - this.cache.timestamp < CACHE_DURATION) {
      return this.cache.data;
    }

    try {
      const newsData = await this.fetchFromAPI();
      const processedNews = this.processNewsData(newsData);
      
      this.cache = {
        data: processedNews,
        timestamp: Date.now()
      };
      
      return processedNews;
      
    } catch (error) {
      console.error('Error fetching news:', error);
      return this.processNewsData(this.getMockNewsData());
    }
  }

  async fetchFromAPI() {
    try {
      const response = await fetch('/api/news');
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      return data.articles || [];
      
    } catch (err) {
      console.error('Error fetching from API:', err);
      return this.getMockNewsData();
    }
  }

  processNewsData(articles) {
    return articles.map((article, index) => {
      const severity = this.determineSeverity(article);
      const category = this.determineCategory(article);
      const tags = this.extractTags(article);
      
      return {
        id: article.url || index + 1,
        title: article.title || 'No title',
        description: article.description || article.content?.substring(0, 150) || 'No description',
        source: article.source?.name || 'Unknown',
        date: article.publishedAt || new Date().toISOString(),
        severity: severity,
        category: category,
        link: article.url || '#',
        tags: tags,
        imageUrl: article.urlToImage
      };
    });
  }

  determineSeverity(article) {
    const text = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    
    const criticalKeywords = [
      'emergency', 'evacuate', 'danger', 'red alert',
      'severe flooding', 'extreme', 'disaster'
    ];
    
    const highKeywords = [
      'heavy rain', 'flood alert', 'water-logging',
      'imd warning', 'orange alert', 'schools closed'
    ];
    
    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return 'critical';
    }
    
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    
    if (text.includes('rain') || text.includes('monsoon')) {
      return 'medium';
    }
    
    return 'info';
  }

  determineCategory(article) {
    const text = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    
    if (text.includes('delhi') || text.includes('ncr')) {
      return 'delhi';
    }
    
    if (this.determineSeverity(article) === 'critical') {
      return 'critical';
    }
    
    return 'national';
  }

  extractTags(article) {
    const tags = new Set();
    const text = ((article.title || '') + ' ' + (article.description || '')).toLowerCase();
    
    if (text.includes('delhi')) tags.add('Delhi');
    if (text.includes('imd')) tags.add('IMD');
    if (text.includes('pwd')) tags.add('PWD');
    if (text.includes('mcd')) tags.add('MCD');
    if (text.includes('monsoon')) tags.add('Monsoon');
    if (text.includes('flood')) tags.add('Flood');
    if (text.includes('rainfall') || text.includes('rain')) tags.add('Rainfall');
    if (text.includes('yamuna')) tags.add('Yamuna');
    
    return Array.from(tags).slice(0, 5);
  }

  filterNewsByKeywords(news, filterType) {
    switch (filterType) {
      case 'critical':
        return news.filter(item => item.severity === 'critical' || item.severity === 'high');
      case 'delhi':
        return news.filter(item => 
          item.category === 'delhi' || 
          item.tags?.includes('Delhi')
        );
      case 'national':
        return news.filter(item => item.category === 'national');
      default:
        return news;
    }
  }

  getMockNewsData() {
    return [
      {
        title: 'IMD Issues Red Alert for Delhi-NCR, Heavy Rainfall Expected',
        description: 'The India Meteorological Department has issued a red alert for Delhi and surrounding areas, predicting extremely heavy rainfall over the next 48 hours.',
        source: { name: 'Times of India' },
        publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        url: 'https://timesofindia.indiatimes.com',
        urlToImage: null
      },
      {
        title: 'PWD Deploys 200 Additional Pump Sets Across Delhi',
        description: 'Public Works Department has deployed additional water pumps in all flood-prone zones as preventive measure ahead of monsoon season.',
        source: { name: 'Hindustan Times' },
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        url: 'https://hindustantimes.com'
      },
      {
        title: 'Traffic Police Issues Advisory for 25 Water-Logging Hotspots',
        description: 'Delhi Traffic Police has identified critical water-logging points and suggested alternative routes for commuters.',
        source: { name: 'The Hindu' },
        publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        url: 'https://thehindu.com'
      },
      {
        title: 'Yamuna Water Level Rising, Low-Lying Areas on Alert',
        description: 'Water level in Yamuna river continues to rise due to heavy rainfall in catchment areas, putting low-lying regions at risk.',
        source: { name: 'NDTV' },
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        url: 'https://ndtv.com'
      }
    ];
  }
}

const newsServiceInstance = new NewsService();

export default newsServiceInstance;
export const fetchFloodNews = () => newsServiceInstance.fetchFloodNews();
export const filterNewsByKeywords = (news, filterType) => 
  newsServiceInstance.filterNewsByKeywords(news, filterType);
