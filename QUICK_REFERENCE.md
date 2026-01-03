# FloodSight Delhi - Quick Reference Card

## 🚀 Installation (Copy-Paste)

```bash
# Copy files to your project
cp src/utils/RiskLogic.js → YOUR_PROJECT/src/utils/
cp src/data/wardData.js → YOUR_PROJECT/src/data/
cp src/components/SmartMap.jsx → YOUR_PROJECT/src/components/
cp src/components/SOSSidebar.jsx → YOUR_PROJECT/src/components/
cp src/components/FloodSightDemo.jsx → YOUR_PROJECT/src/components/

# Install dependencies (if not already present)
npm install react-leaflet@4.2.1 leaflet@1.9.4

# Start your app
npm start
```

---

## 📦 Files Created

| File | Location | Size | Purpose |
|------|----------|------|---------|
| RiskLogic.js | src/utils/ | 3.5 KB | Utility functions |
| wardData.js | src/data/ | 6 KB | Ward data (8 wards) |
| SmartMap.jsx | src/components/ | 8 KB | Interactive map |
| SOSSidebar.jsx | src/components/ | 9 KB | Emergency sidebar |
| FloodSightDemo.jsx | src/components/ | 2 KB | Integration demo |

---

## 💡 Quick Usage Examples

### Use All Features Together
```jsx
import FloodSightDemo from './components/FloodSightDemo';

function App() {
  return <FloodSightDemo />;
}
```

### Use Just the Map
```jsx
import SmartMap from './components/SmartMap';

function App() {
  return <SmartMap />;
}
```

### Use Just Emergency Info
```jsx
import SOSSidebar from './components/SOSSidebar';

function App() {
  return <SOSSidebar selectedWardId="W001" />;
}
```

### Use Risk Calculation
```jsx
import { calculateRisk, getRiskColor } from './utils/RiskLogic';

const risk = calculateRisk(55, 25);  // 'High'
const color = getRiskColor(risk);    // '#ef4444'
```

---

## 🎮 Feature Checklist

### SmartMap Features
- [ ] Ward polygons render colored by risk
- [ ] Click ward → Shows details panel
- [ ] Click "Report Flood" → Opens form
- [ ] Submit report → Ward turns red, localStorage updated
- [ ] Safe Route toggle → Shows flood zone warnings
- [ ] Legend visible → Bottom-left corner
- [ ] Toast notifications → Appear 3 seconds

### SOSSidebar Features
- [ ] Displays selected ward info
- [ ] Shows MCD helpline number
- [ ] Shows hospital with directions
- [ ] Alert status displays (color-coded)
- [ ] Language toggle EN/HI works
- [ ] All text translates to Hindi
- [ ] Call buttons work (tel: protocol)

### RiskLogic Features
- [ ] calculateRisk returns correct levels
- [ ] Reports save to localStorage
- [ ] Reports persist on page refresh
- [ ] Route safety checking works
- [ ] All utility functions export properly

---

## 🎨 Styling Quick Reference

### Risk Colors (Auto-Applied)
```javascript
High Risk   → Red (#ef4444)
Medium Risk → Orange (#f97316)
Low Risk    → Green (#22c55e)
```

### Sidebar Sections (Color-Coded)
```
MCD Control Room  → Red border (bg-red-700)
Nearest Hospital  → Green border (bg-green-700)
Ward Info         → Cyan border (bg-cyan-700)
Safety Tips       → Purple border (bg-purple-700)
Alert Status      → Dynamic colors
```

---

## 📍 Component Props

### SOSSidebar Props
```jsx
<SOSSidebar
  selectedWardId="W001"              // Optional: Ward ID
  onCallHelpline={(number) => {}}    // Optional: Call callback
  onReportIncident={() => {}}        // Optional: Report callback
/>
```

### SmartMap Props
```jsx
<SmartMap />  // No required props (uses internal state)
```

---

## 💾 localStorage Management

### Save a Report
```javascript
import { saveReportToLocal } from './utils/RiskLogic';

saveReportToLocal({
  wardId: 'W001',
  wardName: 'Kasturba Nagar',
  description: 'Water overflowing',
  latitude: 28.5355,
  longitude: 77.2707
});
```

### Get All Reports
```javascript
import { getReportsFromLocal } from './utils/RiskLogic';

const reports = getReportsFromLocal();
reports.forEach(r => console.log(r.description));
```

### Get Ward-Specific Reports
```javascript
import { getWardReports } from './utils/RiskLogic';

const w001Reports = getWardReports('W001');
```

### Clear All Reports
```javascript
import { clearAllReports } from './utils/RiskLogic';

clearAllReports();  // Removes floodReports key
```

---

## 🗺️ Map Configuration

### Change Map Center
```jsx
// In SmartMap.jsx, line 80
<MapContainer 
  center={[28.7041, 77.1025]}  // [latitude, longitude]
  zoom={11}                     // 1-18 scale
```

### Supported Zoom Levels
- 1-5: Country level
- 6-10: City level
- 11-14: Neighborhood level
- 15-18: Street level

### Change Sidebar Width
```jsx
// In SOSSidebar.jsx, line 65
<div className="w-96 ...">  // Change w-96 (384px) to any Tailwind width
```

---

## 🌐 Add Languages

### Add Hindi (Already Included)
```jsx
// In SOSSidebar.jsx, just use language toggle
setLanguage('hi')  // Automatically switches to Hindi
```

### Add Other Languages
```javascript
// In SOSSidebar.jsx translations object, add:

const translations = {
  en: { /* existing */ },
  hi: { /* existing */ },
  ta: {  // Tamil
    title: 'அவசர எஸ்ओஎஸ்',
    selectedWard: 'தேர்ந்தெடுக்கப்பட்ட பகுதி',
    // ... add all labels
  }
};

// Add button:
<button onClick={() => setLanguage('ta')}>TA</button>
```

---

## 🧪 Testing Checklist

```
Basic Functionality:
  [ ] Map loads without errors
  [ ] 8 ward polygons visible
  [ ] Click ward → Panel appears
  [ ] Submit report → Ward turns red
  [ ] Page refresh → Reports persist

Advanced Features:
  [ ] Language toggle works
  [ ] Call buttons show tel: prompt
  [ ] Directions button opens Google Maps
  [ ] Safe Route toggle enables
  [ ] Route warning appears correctly

Edge Cases:
  [ ] No ward selected → Sidebar shows "select a ward"
  [ ] localStorage full → Graceful fallback
  [ ] Invalid coordinates → Map still renders
  [ ] Very long report text → Textarea scrolls
```

---

## ⚡ Performance Tips

### Optimize Ward Data
```javascript
// Instead of 1000 wards, start with ~10
// Add pagination/search if needed
export const wardData = [
  // Critical wards only
];

// Fetch others on demand:
const loadMoreWards = async () => {
  const moreData = await fetch('/api/wards');
  // ...
};
```

### Cache Calculations
```javascript
// Memoize risk calculations
const riskCache = new Map();
const calculateRiskMemo = (rainfall, drainage) => {
  const key = `${rainfall}-${drainage}`;
  if (!riskCache.has(key)) {
    riskCache.set(key, calculateRisk(rainfall, drainage));
  }
  return riskCache.get(key);
};
```

### Limit Report History
```javascript
// Only keep last 1000 reports
const MAX_REPORTS = 1000;
const reports = getReportsFromLocal();
if (reports.length > MAX_REPORTS) {
  reports.splice(MAX_REPORTS);  // Remove oldest
  localStorage.setItem('floodReports', JSON.stringify(reports));
}
```

---

## 🔍 Debugging Tips

### Check Ward Data
```javascript
// In browser console:
import { wardData } from './src/data/wardData';
console.table(wardData);
```

### Check Reports in Storage
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('floodReports')));
```

### Check Map Rendering
```javascript
// In browser console:
window.L  // Leaflet object should exist
```

### Check Risk Calculations
```javascript
// In browser console:
import { calculateRisk, getRiskColor } from './src/utils/RiskLogic';
calculateRisk(55, 25);    // Expected: 'High'
getRiskColor('High');      // Expected: '#ef4444'
```

---

## 🆘 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Map blank | Leaflet CSS missing | Import leaflet.css |
| Icons missing | Marker icon path wrong | Check delete L.Icon code |
| Colors wrong | CSS not loaded | Verify Tailwind setup |
| Hindi garbled | Encoding issue | Add UTF-8 meta tag |
| Reports lost | localStorage cleared | Check browser settings |
| No phone dial | tel: not supported | Only works on mobile |

---

## 📊 Risk Calculation Logic

```javascript
// Exact logic in calculateRisk():

if (rainfall > 50 && drainage < 30) {
  return 'High';
}

if ((rainfall > 30 && rainfall <= 50) || 
    (drainage >= 30 && drainage < 60)) {
  if (userReports > 0) {
    return 'Medium';
  }
  return 'Low';
}

if (userReports > 3) {
  return 'Medium';
}

return 'Low';
```

---

## 🎯 Customization Checklist

```
Ward Data:
  [ ] Add/remove wards
  [ ] Update helpline numbers
  [ ] Change hospital info
  [ ] Adjust coordinates
  [ ] Modify geometries

Risk Calculation:
  [ ] Change rainfall threshold (50mm)
  [ ] Change drainage threshold (30%)
  [ ] Adjust report weight

Styling:
  [ ] Change sidebar width
  [ ] Modify color scheme
  [ ] Update fonts
  [ ] Adjust spacing

Languages:
  [ ] Add new language
  [ ] Update translations
  [ ] Test text rendering

Map:
  [ ] Change center coordinates
  [ ] Adjust zoom level
  [ ] Switch tile provider
  [ ] Add custom layers
```

---

## 📚 Documentation Map

```
SETUP_GUIDE.md
└─ Installation → Configuration → Deployment

FLODSIGHT_GUIDE.md
└─ Features → Usage → Integration → localStorage

QUICK_START_EXAMPLES.js
└─ 7 copy-paste examples for common tasks

TECHNICAL_SPECIFICATIONS.md
└─ Architecture → Performance → Testing → Future enhancements

This Quick Reference Card
└─ Instant lookup for key tasks
```

---

## 🚀 Deploy Checklist

Before deploying to production:

```
Code:
  [ ] No console errors
  [ ] localStorage handling robust
  [ ] Error boundaries in place
  [ ] No hardcoded API keys

Testing:
  [ ] All features tested
  [ ] Different browsers verified
  [ ] Mobile responsive checked
  [ ] Offline functionality tested

Optimization:
  [ ] Build optimized (npm run build)
  [ ] Assets minified
  [ ] Images optimized
  [ ] Bundle analyzed

Documentation:
  [ ] README updated
  [ ] Deployment instructions clear
  [ ] Changelog recorded
```

---

## 📞 Get Help

1. **Setup Issues** → Check SETUP_GUIDE.md
2. **Feature Questions** → Check FLODSIGHT_GUIDE.md
3. **Code Examples** → Check QUICK_START_EXAMPLES.js
4. **Technical Details** → Check TECHNICAL_SPECIFICATIONS.md
5. **Quick Answer** → Check this Quick Reference Card

---

**Version:** 1.0  
**Last Updated:** 2024-01-02  
**Status:** Production Ready ✅

---

## Keyboard Shortcuts (Browser DevTools)

```
F12                      → Open DevTools
Ctrl+Shift+C             → Inspect Element
Ctrl+` (backtick)        → Open Console
localStorage             → View storage (Application tab)
Network → XHR            → Monitor API calls
```

---

## One-Liner Deployment Commands

```bash
# Vercel
npm install -g vercel && vercel

# Netlify
npm run build && zip -r deploy.zip build/ && # drag to netlify

# Firebase
firebase login && firebase init && firebase deploy

# GitHub Pages
npm run build && git add . && git commit -m "deploy" && git push
```

---

**Happy Coding! 🎉**
