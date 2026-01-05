# Language System Integration Guide

## 📖 How to Use the Bilingual System

### Step 1: Wrap Your App with LanguageProvider

In **`src/index.js`** or **`src/App.jsx`**, wrap your app:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
```

---

### Step 2: Add LanguageToggle to Header

In **`src/components/Header.jsx`** or **`src/components/OfficialHeader.jsx`**:

```jsx
import React from 'react';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="bg-blue-900 text-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('jalNivaranPortal')}</h1>
          <p className="text-sm">{t('municipalCorporation')}</p>
        </div>
        
        {/* Language Toggle Button */}
        <LanguageToggle />
      </div>
    </header>
  );
};

export default Header;
```

---

### Step 3: Integrate in RiskCard Component

**Original RiskCard.jsx (Before)**:
```jsx
const RiskCard = ({ title, value, status }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
      <span className="text-xs">High Risk</span>
    </div>
  );
};
```

**Updated RiskCard.jsx (After)**:
```jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const RiskCard = ({ title, value, status }) => {
  const { t } = useLanguage();

  // Map status to translation key
  const getStatusText = (status) => {
    const statusMap = {
      'high': 'highRisk',
      'medium': 'mediumRisk',
      'low': 'lowRisk',
      'critical': 'critical',
      'normal': 'normal',
      'safe': 'safe'
    };
    return t(statusMap[status.toLowerCase()] || status);
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
      <span className="text-xs">
        {getStatusText(status)}
      </span>
    </div>
  );
};

export default RiskCard;
```

---

### Step 4: Update Dashboard Component

**In `src/components/Dashboard.jsx`**:

```jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import DownloadReportBtn from './DownloadReportBtn';

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('dashboard')}
          </h2>
          <p className="text-sm text-gray-600">
            {t('floodManagement')}
          </p>
        </div>
        <DownloadReportBtn />
      </div>

      {/* Risk Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <RiskCard 
          title={t('riskScore')} 
          value="80/100" 
          status="high" 
        />
        <RiskCard 
          title={t('vulnerableWards')} 
          value="8" 
          status="critical" 
        />
        <RiskCard 
          title={t('deployedTeams')} 
          value="12" 
          status="normal" 
        />
        <RiskCard 
          title={t('activeComplaints')} 
          value="47" 
          status="medium" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
```

---

### Step 5: Update DownloadReportBtn Component

**In `src/components/DownloadReportBtn.jsx`**:

```jsx
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DownloadReportBtn = ({ className = '' }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const { downloadDailyReport } = await import('../services/reportService');
      downloadDailyReport();
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert(`${t('error')}: ${error.message}`);
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
        ${className}
      `}
    >
      <Download className={`w-5 h-5 ${isGenerating ? 'animate-bounce' : ''}`} />
      <span>{isGenerating ? t('loading') : t('downloadDSR')}</span>
    </button>
  );
};

export default DownloadReportBtn;
```

---

### Step 6: Update TimeToFlood Component

```jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TimeToFlood = ({ hours, buffer, rate }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-900">
      <h3 className="font-bold text-lg mb-2">
        {t('timeToFlood')}
      </h3>
      <p className="text-3xl font-bold text-blue-900">
        {hours} {t('hours')}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        {t('monitorClosely')}
      </p>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>{t('remainingBuffer')}:</span>
          <span className="font-semibold">{buffer} {t('mm')}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('rainfallRate')}:</span>
          <span className="font-semibold">{rate} {t('mmPerHour')}</span>
        </div>
      </div>
    </div>
  );
};

export default TimeToFlood;
```

---

## 🎯 Quick Reference

### Available Translation Keys

```javascript
// Status
t('highRisk')       // "उच्च जोखिम (High Risk)"
t('mediumRisk')     // "मध्यम जोखिम"
t('lowRisk')        // "सुरक्षित (Safe)"
t('critical')       // "गंभीर"

// Headings
t('dashboard')      // "मानसून बाढ़ जोखिम मूल्यांकन डैशबोर्ड"
t('delhiFloodRiskMap') // "दिल्ली बाढ़ जोखिम मानचित्र"
t('dailySituationReport') // "दैनिक स्थिति रिपोर्ट (DSR)"

// Actions
t('downloadDSR')    // "DSR डाउनलोड करें (PDF)"
t('deployTeam')     // "टीम भेजें"
t('viewDetails')    // "विवरण देखें"

// Components
t('riskScore')      // "जोखिम स्कोर"
t('vulnerableWards') // "संवेदनशील वार्ड"
t('deployedTeams')  // "तैनात टीमें"
t('waterlogging')   // "जल-जमाव"
```

---

## ✅ Features

- **Instant Toggle**: No page reload required
- **Fallback Safety**: Missing translations default to English
- **Official Hindi**: Formal administrative terminology
- **Type-Safe**: Console warnings for missing keys
- **Easy Integration**: Simple `t()` function

---

## 🔧 Adding New Translations

Edit **`src/context/LanguageContext.jsx`**:

```javascript
const translations = {
  en: {
    myNewKey: 'My English Text',
    // ... other keys
  },
  hi: {
    myNewKey: 'मेरा हिंदी पाठ',
    // ... other keys
  }
};
```

Then use: `{t('myNewKey')}`
