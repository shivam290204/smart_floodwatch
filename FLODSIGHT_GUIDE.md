# FloodSight Delhi - Component Implementation Guide

## Overview
This document explains the three new components built for FloodSight Delhi: **RiskLogic Utility**, **SmartMap Component**, and **SOSSidebar Component**.

---

## 1. RiskLogic Utility (`src/utils/RiskLogic.js`)

### Purpose
Pure utility functions for flood risk calculation and localStorage-based citizen reporting.

### Key Functions

#### `calculateRisk(rainfall, drainageCapacity, userReports)`
```javascript
import { calculateRisk } from '../utils/RiskLogic';

const risk = calculateRisk(55, 25, 2);
// Returns: 'High' (because rainfall > 50mm AND drainage < 30%)
```

**Logic:**
- **High Risk**: `rainfall > 50mm AND drainage < 30%`
- **Medium Risk**: `rainfall 30-50mm OR drainage 30-60% with reports`
- **Low Risk**: Default or if reports < 3

#### `getRiskColor(riskLevel)`
Returns hex color codes for map visualization:
- High → `#ef4444` (Red)
- Medium → `#f97316` (Orange)  
- Low → `#22c55e` (Green)

#### `saveReportToLocal(report)`
```javascript
import { saveReportToLocal } from '../utils/RiskLogic';

const report = {
  wardId: 'W001',
  wardName: 'Kasturba Nagar',
  description: 'Water overflowing from drains',
  latitude: 28.5355,
  longitude: 77.2707
};

const allReports = saveReportToLocal(report);
// Saves to localStorage and returns updated array
```

#### `getReportsFromLocal()`
```javascript
const reports = getReportsFromLocal();
// Returns all citizen reports from localStorage
```

#### `checkRouteForFloodZones(routeCoordinates, highRiskZones)`
```javascript
const route = [[28.5355, 77.2707], [28.5400, 77.2750]];
const risk = checkRouteForFloodZones(route, highRiskZones);
// Returns: { isSafe: false, affectedZones: [...] }
```

---

## 2. SmartMap Component (`src/components/SmartMap.jsx`)

### Purpose
Enhanced Leaflet map with:
- Ward polygon rendering (color-coded by risk)
- Citizen flood reporting with localStorage persistence
- Real-time risk updates when reports are submitted
- Route safety checking with flood zone warnings

### Features

#### Ward Polygons
- Automatically colored: Red (High), Orange (Medium), Green (Low)
- Click to select ward and see details
- Popup displays: Name, Risk Level, Rainfall, Drainage %, Report Count

#### Citizen Reporting
```jsx
<SmartMap />
// User clicks ward → "Report Flood" button → Text area opens
// Submit → Saves to localStorage + Ward turns Red immediately
// Toast confirmation appears
```

#### Route Safety Mode
```jsx
// User enables "Safe Route" checkbox
// Simulates route calculation (1.5s timeout)
// If route passes through High Risk zones:
// → Warning toast: "⚠️ Caution: Route enters [X] flood zone(s)"
// → Lists affected zones with ward names
```

#### Legend
Bottom-left corner shows risk level color codes with labels.

### Integration Example
```jsx
import SmartMap from './components/SmartMap';

function App() {
  return <SmartMap />;
}
```

---

## 3. SOSSidebar Component (`src/components/SOSSidebar.jsx`)

### Purpose
Emergency contact sidebar with:
- Ward-specific MCD Control Room helpline
- Nearest hospital with directions link
- Real-time alert status (Normal/Watering/Clogged/Flooding)
- Hindi/English toggle for all labels

### Props
```javascript
<SOSSidebar
  selectedWardId="W001"  // Ward ID from map selection
  onCallHelpline={(number) => {}}  // Callback when user clicks Call
  onReportIncident={() => {}}  // Callback for citizen reporting
/>
```

### Features

#### Language Toggle
- Top-right: EN/HI buttons
- Instantly switches all text to selected language
- Persists across component lifecycle

#### Alert Status Card
Real-time status display:
- 🟢 **Normal**: Green - No issues
- 🟡 **Watering**: Blue - Street cleaning/watering
- 🟡 **Clogged**: Yellow - Clogged drains
- 🟠 **Flooding**: Orange - Active flooding
- 🔴 **Severe**: Red - Severe flooding

#### Emergency Contacts
**MCD Control Room** (Red section):
- Phone number specific to selected ward
- "Call Now" button initiates phone call
- Real-time status check

**Nearest Hospital** (Green section):
- Hospital name and distance
- Phone number
- "Call Now" button
- "Directions" button → Opens Google Maps

#### Ward Information
- Area in sq km
- Population density
- Drainage capacity %

#### Safety Tips
Static list of flood safety guidelines in selected language.

### Integration Example
```jsx
import SOSSidebar from './components/SOSSidebar';
import { useState } from 'react';

function App() {
  const [selectedWardId, setSelectedWardId] = useState(null);

  return (
    <div className="flex">
      <div className="flex-1">
        {/* Your map component */}
      </div>
      <SOSSidebar 
        selectedWardId={selectedWardId}
        onReportIncident={() => console.log('Report incident')}
      />
    </div>
  );
}
```

---

## 4. Ward Data (`src/data/wardData.js`)

Pre-populated with 8 Delhi wards with:
- Geometry (GeoJSON Polygon coordinates)
- Risk level (High/Medium/Low)
- Rainfall and drainage data
- MCD helpline numbers
- Nearest hospital info

### Helper Functions

#### `getWardById(wardId)`
```javascript
import { getWardById } from '../data/wardData';

const ward = getWardById('W001');
// Returns full ward object
```

#### `getWardsByRiskLevel(riskLevel)`
```javascript
const highRiskWards = getWardsByRiskLevel('High');
// Returns all High Risk wards
```

#### `getNearbyWards(lat, lng, radiusKm)`
```javascript
const nearby = getNearbyWards(28.5355, 77.2707, 5);
// Returns wards within 5km radius
```

---

## 5. Complete Integration Example

### Option A: Standalone Demo
```jsx
// src/pages/FloodSightDemo.jsx
import SmartMap from '../components/SmartMap';
import SOSSidebar from '../components/SOSSidebar';
import { useState } from 'react';

export default function FloodSightDemo() {
  const [selectedWardId, setSelectedWardId] = useState(null);

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <SmartMap />
      </div>
      <SOSSidebar selectedWardId={selectedWardId} />
    </div>
  );
}
```

### Option B: In Existing App
```jsx
// Integrate into your existing App.jsx
import SmartMap from './components/SmartMap';
import SOSSidebar from './components/SOSSidebar';

function App() {
  const [selectedWardId, setSelectedWardId] = useState(null);

  return (
    <div className="flex">
      <main className="flex-1">
        <SmartMap onWardSelect={setSelectedWardId} />
      </main>
      <aside className="w-96">
        <SOSSidebar selectedWardId={selectedWardId} />
      </aside>
    </div>
  );
}
```

---

## 6. localStorage Structure

### Flood Reports Key: `floodReports`
```json
[
  {
    "id": "report_1704110400000",
    "wardId": "W001",
    "wardName": "Kasturba Nagar",
    "description": "Water overflowing from drains near Market Street",
    "latitude": 28.5355,
    "longitude": 77.2707,
    "timestamp": "2024-01-02T10:30:00.000Z"
  }
]
```

### Accessing Data
```javascript
// Read all reports
const reports = JSON.parse(localStorage.getItem('floodReports') || '[]');

// Clear all reports
localStorage.removeItem('floodReports');

// Check for specific ward reports
const wardReports = reports.filter(r => r.wardId === 'W001');
```

---

## 7. Styling & Theme

All components use **Tailwind CSS** with a professional government theme:

### Color Scheme
- **Primary**: Blue (`bg-blue-900`, `bg-blue-800`)
- **Alert**: Yellow (`border-yellow-400`, `text-yellow-300`)
- **Risk Levels**: 
  - High: Red (`#ef4444`)
  - Medium: Orange (`#f97316`)
  - Low: Green (`#22c55e`)

### Responsive Design
- Sidebar width: `w-96` (384px on desktop)
- Flex layout for responsive map area
- Mobile-friendly button sizes

---

## 8. Browser Compatibility

✅ All modern browsers (Chrome, Firefox, Safari, Edge)  
✅ localStorage API support  
✅ ES6+ JavaScript features  
✅ Leaflet 1.9.4  
✅ React 18+  
✅ Tailwind CSS 3+

---

## 9. Error Handling

### localStorage Errors
```javascript
try {
  saveReportToLocal(report);
} catch (error) {
  console.error('Storage error:', error);
  // Gracefully fallback to in-memory storage
}
```

### Map Rendering
- If GeoJSON is invalid, component fails gracefully
- Fallback: Display legend and controls only

### Phone Calls
- Uses `tel:` protocol (works on mobile, desktop opens dialer if available)
- Shows confirmation dialog before calling

---

## 10. Testing Checklist

- [ ] Ward polygons render with correct colors
- [ ] Click ward → Details panel appears
- [ ] Click "Report Flood" → Form opens
- [ ] Submit report → Ward turns red, toast shows
- [ ] localStorage has new report after refresh
- [ ] Language toggle switches all text EN ↔ HI
- [ ] "Call Now" buttons trigger phone protocol
- [ ] "Directions" button opens Google Maps
- [ ] Safe Route checkbox toggles route mode
- [ ] Route warning appears when flooding detected
- [ ] Legend displays all three risk colors
- [ ] Sidebar scrolls when content exceeds viewport

---

## 11. Performance Optimizations

### Implemented
- Lazy-loaded ward data (only 8 wards in wardData.js)
- localStorage caching of reports (no API calls)
- Efficient GeoJSON rendering with react-leaflet
- Memoized color calculations

### Future Enhancements
- Virtual scrolling for large report lists
- Debounced route calculations
- Service Worker for offline support
- IndexedDB for large datasets

---

## 12. Government Compliance Notes

✅ **Accessibility**: ARIA labels on buttons, high contrast colors  
✅ **Data Privacy**: All data stored locally (no external servers)  
✅ **Responsive**: Works on tablets and mobile  
✅ **Languages**: Hindi & English support  
✅ **Offline**: Functions without internet (localStorage data)

---

## Quick Start

1. **Copy all files** to your project:
   - `src/utils/RiskLogic.js`
   - `src/data/wardData.js`
   - `src/components/SmartMap.jsx`
   - `src/components/SOSSidebar.jsx`

2. **Install dependencies** (already in package.json):
   ```bash
   npm install
   ```

3. **Import and use**:
   ```jsx
   import SmartMap from './components/SmartMap';
   import SOSSidebar from './components/SOSSidebar';
   ```

4. **Test in browser**: http://localhost:3000

---

**Built with ❤️ for Delhi Flood Safety**
