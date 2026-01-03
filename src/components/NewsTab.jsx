import { useState, useEffect } from 'react';
import { fetchFloodNews, filterNewsByKeywords } from '../services/newsService';

const NewsTab = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'critical', label: 'Critical Alerts' },
    { id: 'delhi', label: 'Delhi Specific' },
    { id: 'national', label: 'National' }
  ];

  useEffect(() => {
    loadNews();
    const interval = setInterval(() => {
      loadNews();
    }, 15 * 60 * 1000); // Refresh every 15 minutes
    
    return () => clearInterval(interval);
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const newsData = await fetchFloodNews();
      
      let filteredNews = newsData;
      if (searchTerm) {
        filteredNews = filteredNews.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filter !== 'all') {
        filteredNews = filterNewsByKeywords(filteredNews, filter);
      }
      
      setNews(filteredNews);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch news. Using fallback data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadNews();
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getSourceIcon = (source) => {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('times')) return '📰';
    if (lowerSource.includes('hindu')) return '📖';
    if (lowerSource.includes('imd')) return '🌧️';
    if (lowerSource.includes('ndtv')) return '📺';
    return '📰';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📰</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Flood Watch News & Alerts</h2>
              <p className="text-gray-600 text-sm">
                Latest updates, advisories, and emergency alerts for Delhi
                {lastUpdated && (
                  <span className="ml-2 text-gray-500">
                    • Updated {formatTimeAgo(lastUpdated)}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <button
            onClick={loadNews}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <span className={loading ? 'animate-spin' : ''}>🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search news (flood, water-logging, monsoon, advisory...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-600 font-semibold">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setFilter(cat.id);
                setTimeout(loadNews, 100);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                filter === cat.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching latest news updates...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <div>
              <p className="font-medium text-yellow-800">{error}</p>
              <p className="text-yellow-700 text-sm mt-1">
                Showing cached or fallback data. News will refresh automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* News Grid */}
      {!loading && (
        <>
          {news.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <h3 className="text-lg font-medium text-gray-700">No news found</h3>
              <p className="text-gray-500 mt-1">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <>
              {/* Critical Alerts First */}
              {news.filter(item => item.severity === 'critical').map((item) => (
                <div key={item.id} className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <span className="text-4xl flex-shrink-0">🚨</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm font-bold bg-red-600 text-white">
                            CRITICAL ALERT
                          </span>
                          <span className="text-gray-600 text-sm">
                            {getSourceIcon(item.source)} {item.source}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">{formatTimeAgo(item.date)}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-gray-700 mb-4">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 flex-wrap">
                          {item.tags?.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-white text-gray-700 text-xs rounded border border-gray-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Regular News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.filter(item => item.severity !== 'critical').map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(item.severity)}`}>
                          {item.severity === 'high' ? '🚨 High' : 
                           item.severity === 'medium' ? '⚠️ Medium' : 'ℹ️ Info'}
                        </span>
                        <span className="text-gray-500 text-xs">{formatTimeAgo(item.date)}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          {getSourceIcon(item.source)} {item.source}
                        </span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Read →
                        </a>
                      </div>
                      
                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Stats Footer */}
          {news.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{news.length}</div>
                  <div className="text-gray-600 text-sm">Total Updates</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">
                    {news.filter(n => n.severity === 'critical' || n.severity === 'high').length}
                  </div>
                  <div className="text-gray-600 text-sm">Active Alerts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {news.filter(n => n.category === 'delhi').length}
                  </div>
                  <div className="text-gray-600 text-sm">Delhi Specific</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {new Set(news.map(n => n.source)).size}
                  </div>
                  <div className="text-gray-600 text-sm">Sources</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsTab;
