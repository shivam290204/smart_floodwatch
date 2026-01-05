import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * DownloadReportBtn - Bilingual button for downloading Daily Situation Report (DSR)
 * Styled as a professional utility tool for government officials
 */
const DownloadReportBtn = ({ className = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      
      // Dynamic import to avoid initialization issues
      const { downloadDailyReport } = await import('../services/reportService');
      downloadDailyReport();
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert(`${t('error')}: ${error.message}\n\n${error.toString()}`);
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`
        flex items-center gap-2 px-4 py-2.5 
        bg-gray-800 hover:bg-gray-900 
        text-white font-semibold 
        rounded-md transition-all duration-200
        shadow-md hover:shadow-lg
        active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={t('downloadDSR')}
    >
      <Download className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
      <span>{isGenerating ? t('loading') : t('downloadDSR')}</span>
    </button>
  );
};

export default DownloadReportBtn;
