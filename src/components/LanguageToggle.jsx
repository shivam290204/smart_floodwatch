import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

/**
 * LanguageToggle - Bilingual switch button for Header
 * Toggles between English and Hindi (Official Languages Act compliance)
 */
const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="
        flex items-center gap-2 px-4 py-2
        bg-gray-100 hover:bg-gray-200
        text-gray-900 font-medium
        rounded-md transition-all duration-200
        border border-gray-300 hover:border-gray-400
        active:scale-95
      "
      title={language === 'en' ? 'Switch to Hindi (हिंदी में बदलें)' : 'Switch to English (अंग्रेज़ी में बदलें)'}
      aria-label="Toggle Language"
    >
      <Globe className="w-5 h-5" />
      <span className="text-sm">
        {language === 'en' ? 'English' : 'हिंदी'} / {language === 'en' ? 'हिंदी' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
