/**
 * SETUP_GUIDE.md
 * Step-by-step installation and configuration guide
 */

# FloodSight Delhi - Setup & Configuration Guide

## Prerequisites
- Node.js 14+ and npm installed
- Existing React project (Create React App or similar)
- Basic knowledge of React hooks and npm

## Installation

### Step 1: Copy Files to Your Project

Copy these new files to your project:

```bash
# Copy utility
cp RiskLogic.js → src/utils/

# Copy data
cp wardData.js → src/data/

# Copy components
cp SmartMap.jsx → src/components/
cp SOSSidebar.jsx → src/components/
cp FloodSightDemo.jsx → src/components/

# Copy documentation
cp FLODSIGHT_GUIDE.md → project/root/
cp QUICK_START_EXAMPLES.js → project/root/
cp TECHNICAL_SPECIFICATIONS.md → project/root/
```

### Step 2: Verify Dependencies

Your `package.json` should already have:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-leaflet": "^4.2.1",
    "leaflet": "^1.9.4",
    "tailwindcss": "^3.3.6"
  }
}
```

If missing, install:
```bash
npm install react-leaflet@4.2.1 leaflet@1.9.4 tailwindcss@3.3.6
```

### Step 3: Configure Tailwind CSS

If not already configured, set up Tailwind:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add custom colors if needed
      }
    },
  },
  plugins: [],
}
```

### Step 4: Update CSS File

Ensure your main CSS file (`src/index.css`) includes Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add custom styles here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

## Usage Options

### Option A: Standalone Demo Page

Replace your `App.jsx`:

```jsx
import FloodSightDemo from './components/FloodSightDemo';

function App() {
  return <FloodSightDemo />;
}

export default App;
```

Then run:
```bash
npm start
```

Visit `http://localhost:3000` to see the full demo.

---

### Option B: Integrate into Existing App

#### 1. Add Routes (if using React Router)

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FloodSightDemo from './components/FloodSightDemo';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flood-map" element={<FloodSightDemo />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### 2. Use Just SmartMap (No Sidebar)

```jsx
import SmartMap from './components/SmartMap';

function FloodMonitoring() {
  return (
    <div className="h-screen">
      <SmartMap />
    </div>
  );
}
```

#### 3. Use Just SOSSidebar (No Map)

```jsx
import SOSSidebar from './components/SOSSidebar';
import { useState } from 'react';

function EmergencyInfo() {
  const [selectedWardId, setSelectedWardId] = useState('W001');

  return (
    <SOSSidebar selectedWardId={selectedWardId} />
  );
}
```

#### 4. Use RiskLogic in Existing Components

```jsx
import { calculateRisk, getRiskColor } from './utils/RiskLogic';
import { getWardById } from './data/wardData';

function WardRiskCard({ wardId }) {
  const ward = getWardById(wardId);
  
  if (!ward) return <div>Ward not found</div>;
  
  const risk = calculateRisk(
    ward.rainfall_mm,
    100 - ward.drainageCapacity,
    0
  );
  const color = getRiskColor(risk);

  return (
    <div className="p-4 rounded-lg border-4" style={{ borderColor: color }}>
      <h3>{ward.name}</h3>
      <p style={{ color }}>Risk: {risk}</p>
    </div>
  );
}
```

---

## Configuration Options

### 1. Customize Ward Data

Edit `src/data/wardData.js` to add your wards:

```javascript
export const wardData = [
  {
    id: 'W009',
    name: 'Your Ward Name',
    helplineNumber: '9111-234575',
    nearestHospital: 'Hospital Name - 2.5km',
    hospitalPhone: '011-1234-5678',
    rainfall_mm: 45,
    drainageCapacity: 50,
    riskLevel: 'Medium',
    coordinates: [28.5500, 77.2600],  // [lat, lng]
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.2500, 28.5400], ...]]
    },
    description: 'Ward description',
    area_sqkm: 15.0
  }
];
```

### 2. Customize Risk Calculation Logic

Edit the `calculateRisk()` function in `RiskLogic.js`:

```javascript
export const calculateRisk = (rainfall, drainageCapacity, userReports = 0) => {
  // Modify thresholds here
  if (rainfall > 60 && drainageCapacity < 20) {  // Changed from 50 & 30
    return 'High';
  }
  // ... rest of logic
};
```

### 3. Customize Alert Status Simulation

In `SOSSidebar.jsx`, change the alert status generation:

```javascript
useEffect(() => {
  if (selectedWardId) {
    const ward = getWardById(selectedWardId);
    setSelectedWard(ward);
    
    // Modify alert logic here
    const rainfall = ward.rainfall_mm;
    if (rainfall > 60) {
      setAlertStatus('severe');
    } else if (rainfall > 50) {
      setAlertStatus('flooding');
    } else {
      setAlertStatus('normal');
    }
  }
}, [selectedWardId]);
```

### 4. Customize Colors

Edit `getRiskColor()` in `RiskLogic.js`:

```javascript
export const getRiskColor = (riskLevel) => {
  const colors = {
    High: '#dc2626',     // Darker red
    Medium: '#ea580c',   // Darker orange
    Low: '#16a34a'       // Darker green
  };
  return colors[riskLevel] || '#6b7280';
};
```

Or modify Tailwind classes in components:

```jsx
// Change button color in SmartMap.jsx
<button className="bg-blue-600 hover:bg-blue-700 ...">
  // Changed from orange-500 to blue-600
</button>
```

### 5. Customize Map Center & Zoom

In `SmartMap.jsx`:

```jsx
<MapContainer 
  center={[28.7041, 77.1025]}  // Change this [lat, lng]
  zoom={12}  // Change zoom level (1-18)
  className="w-full h-full"
>
```

### 6. Customize Sidebar Width

In `SOSSidebar.jsx`:

```jsx
<div className="fixed right-0 top-0 h-screen w-96 ...">
  {/* Change w-96 (384px) to w-80 (320px) or w-full for mobile */}
</div>
```

### 7. Customize Language Translations

In `SOSSidebar.jsx`, add new language:

```javascript
const translations = {
  en: { /* existing */ },
  hi: { /* existing */ },
  te: {  // Telugu
    title: 'ఎమర్జెన్సీ ఎస్‌ఒ‌ఎస్',
    selectedWard: 'ఎంచుకున్న వార్డ్',
    // ... add all labels
  }
};

// Then update language toggle buttons
<button onClick={() => setLanguage('te')}>TE</button>
```

---

## Customization Examples

### Example 1: Add More Wards

```javascript
// src/data/wardData.js

export const wardData = [
  // ... existing wards
  {
    id: 'W010',
    name: 'New Ward',
    helplineNumber: '9111-234580',
    nearestHospital: 'Max Hospital - 1.2km',
    hospitalPhone: '011-4455-6677',
    rainfall_mm: 52,
    drainageCapacity: 40,
    riskLevel: 'Medium',
    coordinates: [28.6200, 77.3000],
    geometry: {
      type: 'Polygon',
      coordinates: [[[77.2900, 28.6100], [77.3100, 28.6100], 
                     [77.3100, 28.6300], [77.2900, 28.6300], 
                     [77.2900, 28.6100]]]
    },
    description: 'New commercial district',
    area_sqkm: 12.0
  }
];
```

### Example 2: Connect to Real API

```javascript
// src/services/realDataService.js

export const fetchRealWardData = async () => {
  try {
    const response = await fetch('/api/wards');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    // Fallback to wardData
    return wardData;
  }
};

// Then in SmartMap.jsx
useEffect(() => {
  const loadData = async () => {
    const realData = await fetchRealWardData();
    // Use realData instead of wardData
  };
  loadData();
}, []);
```

### Example 3: Real-Time Report Updates via WebSocket

```javascript
// src/services/realtimeService.js

export const subscribeToReports = (callback) => {
  const ws = new WebSocket('wss://your-api.com/reports');
  
  ws.onmessage = (event) => {
    const report = JSON.parse(event.data);
    saveReportToLocal(report);
    callback(report);
  };
  
  return ws;
};

// In SmartMap.jsx
useEffect(() => {
  const ws = subscribeToReports((newReport) => {
    const saved = getReportsFromLocal();
    setReports(saved);
  });
  
  return () => ws.close();
}, []);
```

---

## Troubleshooting

### Problem: Map not rendering
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Problem: Leaflet marker icons missing
**Solution:** Add to public/index.html head:
```html
<link rel="stylesheet" 
  href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
```

### Problem: Tailwind styles not applied
**Solution:** Check tailwind.config.js content paths:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",  // Ensure this includes all files
]
```

### Problem: localStorage reports disappearing
**Solution:** Check browser settings:
- Ensure cookies/storage not being cleared on exit
- Check localStorage quota: 
  ```javascript
  console.log('Storage used:', new Blob(
    Object.values(localStorage)
  ).size, 'bytes');
  ```

### Problem: Hindi text not displaying
**Solution:** Add to src/index.html head:
```html
<meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
```

Then in index.css:
```css
body {
  font-family: 'Noto Sans Devanagari', system-ui;
}
```

---

## Performance Optimization

### 1. Lazy Load Components

```jsx
import { lazy, Suspense } from 'react';

const SmartMap = lazy(() => import('./components/SmartMap'));
const SOSSidebar = lazy(() => import('./components/SOSSidebar'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SmartMap />
      <SOSSidebar />
    </Suspense>
  );
}
```

### 2. Memoize Components

```jsx
import { memo } from 'react';

const MemoSmartMap = memo(SmartMap, (prev, next) => {
  return prev.selectedWardId === next.selectedWardId;
});

export default MemoSmartMap;
```

### 3. Limit localStorage Entries

```javascript
// In RiskLogic.js
export const saveReportToLocal = (report) => {
  const MAX_REPORTS = 1000;
  const reports = getReportsFromLocal();
  
  if (reports.length >= MAX_REPORTS) {
    reports.pop();  // Remove oldest
  }
  
  const updated = [{ ...report, id: `report_${Date.now()}` }, ...reports];
  localStorage.setItem('floodReports', JSON.stringify(updated));
  return updated;
};
```

---

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag-drop build/ folder to Netlify
```

### Deploy to Firebase
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## Support Resources

- **Complete Guide:** See `FLODSIGHT_GUIDE.md`
- **Code Examples:** See `QUICK_START_EXAMPLES.js`
- **Technical Details:** See `TECHNICAL_SPECIFICATIONS.md`
- **React Leaflet Docs:** https://react-leaflet.js.org/
- **Leaflet Docs:** https://leafletjs.com/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

**Version:** 1.0  
**Last Updated:** 2024-01-02  
**Status:** Ready for production
