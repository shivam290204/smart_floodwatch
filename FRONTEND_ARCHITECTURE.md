# Smart FloodWatch - Frontend Architecture & Workflow Documentation

## Table of Contents
1. [Application Overview](#application-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Application Flow](#application-flow)
4. [Code Flow & Data Flow](#code-flow--data-flow)
5. [Component Hierarchy](#component-hierarchy)
6. [Workflow Diagrams](#workflow-diagrams)
7. [State Management](#state-management)
8. [Feature Workflows](#feature-workflows)

---

## Application Overview

**Smart FloodWatch** is a React-based flood management dashboard built for the Delhi Government. It provides real-time flood risk monitoring, resource management, and emergency response capabilities.

**Key Statistics:**
- 26+ React Components
- 2 Context Providers (DataContext, MapContext)
- 5+ Services (API integrations)
- 4 Main Views (Dashboard, News, Hotspots, How It Works)
- Real-time Data Visualization with Leaflet Maps

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMART FLOODWATCH APPLICATION                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   Header     │  │ HeroSection  │  │ Navigation   │            │
│  │   Component  │  │   Component  │  │   Tabs       │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │            MAIN CONTENT AREA (View Router)                  │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │                                                               │ │
│  │  Dashboard View      │  News View       │  Emergency Ops    │ │
│  │  ───────────────────────────────────────────────────────── │ │
│  │  • FloodMap         │  • NewsTab       │  • Priority List  │ │
│  │  • Risk Cards       │  • Search        │  • Deploy Pumps   │ │
│  │  • Alert System     │  • Filters       │  • Jurisdiction   │ │
│  │  • Resources        │  • Severity      │  • Confirmations  │ │
│  │  • Decision Trace   │    Badges        │                   │ │
│  │                                                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │  Hotspots    │  │ How It Works  │  │ Live Alert   │            │
│  │  & Insights  │  │   Page       │  │  Banner      │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              MODAL COMPONENTS (Overlays)                    │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  • JurisdictionModal  • ReportWaterlogging  • WardPopup    │ │
│  │  • WhatIfScenario     • RiskCard            • TimeToFlood  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────┐           ┌───────────────────┐           │
│  │   DataContext     │           │   MapContext      │           │
│  ├───────────────────┤           ├───────────────────┤           │
│  │ • wards[]         │           │ • mapInstance     │           │
│  │ • wardStatus{}    │           │ • selectedWard    │           │
│  │ • emergencyMode   │           │ • mapBounds       │           │
│  │ • selectedMonth   │           │ • layerControl    │           │
│  │ • hotspots[]      │           │ • markerCluster   │           │
│  │ • dashboard{}     │           │ • selectedFeature │           │
│  └───────────────────┘           └───────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER (API)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │  mcdService      │  │  newsService     │  │  imdService  │   │
│  │  • fetchWards    │  │  • fetchNews     │  │  • getRain   │   │
│  │  • fetchHotspots │  │  • searchNews    │  │  • getTempo  │   │
│  │  • fetchDashboard│  │  • filterByTag   │  │  • getAlerts │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                      │
│  │  api.js          │  │  dataProcessor   │                      │
│  │  • HTTP calls    │  │  • transformData │                      │
│  │  • error handle  │  │  • calculateRisk │                      │
│  │  • caching       │  │  • predictTrends │                      │
│  └──────────────────┘  └──────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER (Assets)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │   GeoJSON Data   │  │  Rainfall Data   │  │  Ward Data   │   │
│  │  • Boundaries    │  │  • north.csv     │  │  • wards.geo │   │
│  │  • Wards         │  │  • south.csv     │  │  • hotspots  │   │
│  │  • Hotspots      │  │  • Historical    │  │  • drainage  │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Application Flow

### User Journey Flow

```
START (Home Page)
    │
    ├─→ [Header] "Jal Nivaran Portal" Navigation
    │   ├─→ Dashboard Tab ────────┐
    │   ├─→ News & Alerts Tab ────┼─→ View Selection
    │   ├─→ Hotspots Tab ────────┤
    │   └─→ How It Works Tab ────┘
    │
    ├─→ [HeroSection] Headline with Call-to-Actions
    │   ├─→ "Report Water-Logging" ──→ ReportWaterlogging Modal
    │   │   └─→ Fill Form ──→ Submit ──→ localStorage ──→ Success Message
    │   │
    │   └─→ "Emergency Resources" ──→ EmergencyOperationsDashboard
    │       └─→ [Check Jurisdiction Modal]
    │           └─→ Select Zone ──→ View MCD/PWD/DDA Info ──→ Clickable Phone
    │
    ├─→ [Dashboard View] (Default)
    │   │
    │   ├─→ [FloodMap] Interactive Leaflet Map
    │   │   ├─→ Click Ward ──→ [WardPopup] Shows:
    │   │   │   ├─→ Ward Name & Risk Level
    │   │   │   ├─→ Rainfall Data
    │   │   │   ├─→ Time to Flood
    │   │   │   ├─→ Dispatch Button
    │   │   │   ├─→ [Dispatch Confirmation]
    │   │   │   └─→ Status Update
    │   │   │
    │   │   ├─→ Zoom/Pan Controls
    │   │   └─→ Layer Toggle (Wards, Hotspots, Drainage)
    │   │
    │   ├─→ [MonthSelector] Calendar Widget
    │   │   └─→ Select Month ──→ Reload Data ──→ Update Map
    │   │
    │   ├─→ [EmergencyResources] Status Cards
    │   │   ├─→ View: Pumps/Teams/Vehicles Status
    │   │   ├─→ [Open Operations Dashboard Button]
    │   │   │   └─→ EmergencyOperationsDashboard
    │   │   │       ├─→ Resource Overview Cards
    │   │   │       ├─→ Priority Wards List
    │   │   │       ├─→ Deploy/Recall Buttons
    │   │   │       ├─→ Mark Resolved
    │   │   │       └─→ [Check Jurisdiction Button]
    │   │   │           └─→ JurisdictionModal (Reusable)
    │   │   │
    │   │   └─→ [View Deployment Details Button]
    │   │       └─→ Alert with Current Status
    │   │
    │   ├─→ [RiskCards] Ward Risk Display
    │   │   ├─→ Color-coded (Green/Yellow/Red)
    │   │   ├─→ Click Card ──→ Highlight on Map
    │   │   └─→ Hover ──→ Show More Details
    │   │
    │   ├─→ [AlertSystem] High-Risk Alerts
    │   │   ├─→ Auto-Update Every 5 mins
    │   │   ├─→ Priority Order
    │   │   └─→ Live Badge
    │   │
    │   ├─→ [DecisionTrace] What-If Scenario
    │   │   ├─→ Select Ward ──→ Change Rainfall ──→ See Risk Change
    │   │   └─→ Export Analysis
    │   │
    │   ├─→ [RainfallTrendAnalysis] Charts
    │   │   └─→ Monthly Trends, Comparisons
    │   │
    │   └─→ [HistoricalComparison] Trends
    │       └─→ View Year-over-Year Data
    │
    ├─→ [News & Alerts Tab]
    │   ├─→ Search Bar ──→ Search News
    │   ├─→ Filter Buttons:
    │   │   ├─→ All News
    │   │   ├─→ Critical Alerts (from NewsAPI)
    │   │   ├─→ Delhi Specific
    │   │   └─→ National
    │   ├─→ News Cards with Images
    │   ├─→ Severity Badges (Critical/High/Medium/Low)
    │   └─→ Click Card ──→ View Full Article
    │
    ├─→ [Hotspots & Insights Tab]
    │   ├─→ Top Flood-Prone Wards List
    │   ├─→ Actionable Insights
    │   ├─→ Risk Statistics
    │   └─→ Recommendations
    │
    ├─→ [How It Works Tab]
    │   ├─→ System Explanation
    │   ├─→ Step-by-Step Guide
    │   ├─→ FAQ Section
    │   └─→ Contact Information
    │
    ├─→ [LiveAlertBanner] Bottom Alert
    │   ├─→ Real-time Yamuna Level
    │   ├─→ Flood Warning Status
    │   └─→ Close Button
    │
    └─→ [Footer]
        └─→ Copyright & Data Sources

```

---

## Code Flow & Data Flow

### Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                         │
│                 (Click, Select, Type, Submit)                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    REACT COMPONENT STATE                         │
│               (useState, local component state)                  │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│              CONTEXT PROVIDERS (Global State)                    │
│                                                                   │
│  DataContext Update                  MapContext Update           │
│  ├─ setWards(newWards)              ├─ setSelectedWard()       │
│  ├─ setWardStatus(status)           ├─ setMapBounds()          │
│  ├─ setEmergencyMode(bool)          └─ updateLayerControl()    │
│  ├─ setSelectedMonth(month)                                     │
│  └─ setHotspots(data)                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER (API Calls)                     │
│                                                                   │
│  Triggered by: useEffect dependencies                            │
│  ├─ mcdService.fetchWardData(month)                             │
│  ├─ newsService.fetchFloodNews()                                │
│  ├─ dataProcessor.calculateRiskIndex()                          │
│  └─ riskCalculator.predictFloodTime()                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                       HTTP REQUESTS (api.js)                     │
│                                                                   │
│  GET /api/wards?month=July                                       │
│  GET /api/hotspots                                               │
│  GET /api/news?search=flood (NewsAPI Integration)               │
│  GET /api/rainfall/historical                                   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                      EXTERNAL DATA SOURCES                        │
│                                                                   │
│  ├─ LocalStorage (Water-logging Reports)                        │
│  ├─ CSV Data (Rainfall Data: north.csv, south.csv)             │
│  ├─ GeoJSON Files (Ward Boundaries, Hotspots)                  │
│  ├─ NewsAPI (Real-time News & Alerts)                          │
│  └─ IMD API (Weather Data)                                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    DATA TRANSFORMATION                           │
│                   (dataProcessor.js, utils)                      │
│                                                                   │
│  Transform → Filter → Calculate → Format                        │
│  ├─ GeoJSON ──→ Risk Polygons (color-coded)                    │
│  ├─ CSV Data ──→ Charts (Chart.js)                              │
│  ├─ API JSON ──→ Card Components                                │
│  └─ Raw Risk ──→ Time-to-Flood Prediction                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    UPDATE CONTEXT STATE                          │
│                   (Context Dispatch/setState)                    │
│                                                                   │
│  setWards(transformedGeoJSON)                                    │
│  setWardStatus(riskCalculations)                                │
│  setHotspots(filteredData)                                      │
│  setDashboard(metrics)                                          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   COMPONENT RE-RENDER                            │
│               (Via useContext Hook Subscription)                 │
│                                                                   │
│  FloodMap ────────→ Updates GeoJSON Layer Colors                │
│  RiskCards ──────→ Updates Risk Display Cards                   │
│  AlertSystem ────→ Shows High-Risk Alerts                       │
│  EmergencyResources → Updates Resource Status                   │
│  Statistics ─────→ Updates Metrics Display                      │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                      VISUAL OUTPUT                               │
│                  (User Sees Updated UI)                          │
│                                                                   │
│  Map changes color | Cards update | Alerts appear               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Data Flow Between Components

```
DataContext
    ↓
    ├→ App.jsx (consumes via useDataContext)
    │   ├→ selectedMonth, setSelectedMonth ──→ MonthSelector
    │   │   └→ onChange ──→ DataContext updates wardStatus
    │   │
    │   ├→ wards[], wardStatus ──→ FloodMap
    │   │   ├→ Maps ward properties to Leaflet GeoJSON
    │   │   └→ Click handler ──→ selectedWard ──→ WardPopup
    │   │
    │   ├→ wards[] ──→ RiskCards
    │   │   └→ Display each ward as card
    │   │
    │   ├→ emergencyMode ──→ Header (toggle)
    │   │   └→ On toggle ──→ DataContext transforms wards
    │   │
    │   └→ hotspots[] ──→ HotspotsInsights
    │       └→ Display top flood-prone wards

NewsService
    ↓
    └→ NewsTab (fetches news on mount)
        └→ Display filtered news cards

RiskCalculator
    ↓
    └→ DecisionTrace (calculates what-if scenarios)
        └→ Update risk visualization

MLPredictor
    ↓
    └→ PredictionBox (predicts future risks)
        └→ Show time-to-flood
```

---

## Component Hierarchy

```
App (Root)
│
├─ DataProvider (Context Wrapper)
│  └─ MapProvider (Context Wrapper)
│     │
│     ├─ Header
│     │  └─ Scenario Mode Toggle
│     │
│     ├─ LiveAlertBanner
│     │  └─ Real-time Flood Warning
│     │
│     ├─ HeroSection (Dashboard View)
│     │  ├─ ReportWaterlogging (Modal)
│     │  │  └─ Form submission → localStorage
│     │  │
│     │  └─ Emergency Resources Navigation
│     │
│     ├─ Navigation (Tabs)
│     │  ├─ Dashboard Tab
│     │  ├─ News & Alerts Tab
│     │  ├─ Hotspots Tab
│     │  └─ How It Works Tab
│     │
│     ├─ [CONDITIONAL VIEW RENDERING]
│     │
│     ├─ Dashboard View (currentView === 'dashboard')
│     │  ├─ FloodMap
│     │  │  ├─ WardPopup (on ward click)
│     │  │  │  ├─ TimeToFlood
│     │  │  │  └─ Dispatch Button
│     │  │  │
│     │  │  └─ Leaflet Layers
│     │  │     ├─ GeoJSON Layer (wards)
│     │  │     ├─ Marker Cluster (hotspots)
│     │  │     └─ Heatmap Layer
│     │  │
│     │  ├─ Sidebar (Right)
│     │  │  ├─ MonthSelector
│     │  │  ├─ RiskCards (list of wards)
│     │  │  └─ FilterControls
│     │  │
│     │  ├─ EmergencyResources
│     │  │  ├─ Resource Status Cards
│     │  │  └─ [Open Operations Dashboard Button]
│     │  │     └─ EmergencyOperationsDashboard
│     │  │        ├─ Resource Overview (4 cards)
│     │  │        ├─ Priority Wards List
│     │  │        │  └─ Deploy/Recall Buttons
│     │  │        ├─ Active Deployments
│     │  │        └─ JurisdictionModal (Reusable)
│     │  │           └─ Zone/Jurisdiction Lookup
│     │  │
│     │  ├─ AlertSystem
│     │  │  └─ High-risk alerts list
│     │  │
│     │  ├─ DecisionTrace
│     │  │  ├─ Select Ward
│     │  │  ├─ Adjust Rainfall
│     │  │  └─ See Risk Change
│     │  │
│     │  ├─ RainfallTrendAnalysis
│     │  │  └─ Chart.js visualization
│     │  │
│     │  └─ HistoricalComparison
│     │     └─ Year-over-year comparison
│     │
│     ├─ News View (currentView === 'news')
│     │  └─ NewsTab
│     │     ├─ Search Bar
│     │     ├─ Filter Buttons (All/Critical/Delhi/National)
│     │     └─ News Cards List
│     │        ├─ Image
│     │        ├─ Title
│     │        ├─ Description
│     │        ├─ Source Badge
│     │        └─ Severity Badge
│     │
│     ├─ Hotspots View (currentView === 'hotspots')
│     │  └─ HotspotsInsights
│     │     ├─ Top Flood-Prone Wards
│     │     ├─ Risk Statistics
│     │     └─ Actionable Recommendations
│     │
│     ├─ How It Works View (currentView === 'how-it-works')
│     │  └─ HowItWorks
│     │     ├─ System Overview
│     │     ├─ Step-by-Step Guide
│     │     ├─ FAQ
│     │     └─ Contact Info
│     │
│     └─ Footer
│        └─ Copyright & Data Sources

```

---

## Workflow Diagrams

### 1. Water-Logging Report Workflow

```
START: User sees water-logging
    │
    └─→ [HeroSection]
        │
        └─→ Click "Report Water-Logging"
            │
            ├─→ [ReportWaterlogging Modal Opens]
            │
            ├─→ Select Ward from dropdown
            │   └─→ (Populated from DataContext.wards)
            │
            ├─→ Enter Location (address/details)
            │
            ├─→ Select Severity (Low/Medium/High)
            │
            ├─→ Add Comment (optional)
            │
            ├─→ Click Submit
            │   │
            │   ├─→ Validate Form Data
            │   │
            │   ├─→ Create Report Object:
            │   │   {
            │   │     id: timestamp,
            │   │     ward: selectedWard,
            │   │     location: userInput,
            │   │     severity: selected,
            │   │     comment: text,
            │   │     timestamp: ISO string
            │   │   }
            │   │
            │   ├─→ Retrieve existing reports from localStorage
            │   │   (JSON.parse('waterlogReports'))
            │   │
            │   ├─→ Push new report to array
            │   │
            │   ├─→ Save back to localStorage
            │   │   (JSON.stringify(reportsArray))
            │   │
            │   └─→ Show Success Animation
            │       └─→ "Report Submitted Successfully"
            │           └─→ Auto-close modal after 2 seconds
            │
            └─→ [Report is stored locally & can be viewed by government officials]

```

### 2. Emergency Resource Deployment Workflow

```
START: High-Risk Ward Detected
    │
    ├─→ [DataContext] Calculates Risk Index
    │   └─→ IF riskLevel === 'High' → Auto-deploy begins
    │
    ├─→ [EmergencyResources] Shows Status Update
    │   ├─→ Pumps: 0/50 → 4/50 (deployed)
    │   ├─→ Teams: 0/12 → 2/12 (deployed)
    │   └─→ Vehicles: 0/8 → 1/8 (deployed)
    │
    ├─→ User Clicks "Open Operations Dashboard"
    │   │
    │   └─→ [EmergencyOperationsDashboard]
    │       │
    │       ├─→ Shows Resource Overview Cards
    │       │   ├─→ Pumps Available: 46
    │       │   ├─→ Pumps Deployed: 4
    │       │   ├─→ Response Teams Active: 2
    │       │   └─→ Avg Response Time: 21m
    │       │
    │       ├─→ Shows Priority Wards List
    │       │   └─→ Each high-risk ward has:
    │       │       ├─→ Ward Name
    │       │       ├─→ Risk Level Badge
    │       │       ├─→ Reason for Priority
    │       │       ├─→ [Deploy Pump Button]
    │       │       │   └─→ ON CLICK:
    │       │       │       ├─→ Check if pumps available
    │       │       │       ├─→ Update deployments state
    │       │       │       ├─→ Show confirmation: "Pump deployed to Ward X"
    │       │       │       └─→ Resource counts update
    │       │       │
    │       │       ├─→ [Assign Team Button]
    │       │       │   └─→ ON CLICK:
    │       │       │       ├─→ Update deployments state
    │       │       │       ├─→ Show confirmation: "Team assigned to Ward X"
    │       │       │       └─→ Add to active deployments list
    │       │       │
    │       │       └─→ [Mark Resolved Button]
    │       │           └─→ ON CLICK:
    │       │               ├─→ Remove all deployments for ward
    │       │               ├─→ Show confirmation: "Ward X marked resolved"
    │       │               └─→ Free up resources
    │       │
    │       ├─→ Shows Active Deployments Section
    │       │   └─→ Lists all current deployments with timestamps
    │       │
    │       ├─→ [Check Jurisdiction Button]
    │       │   │
    │       │   └─→ [JurisdictionModal Opens]
    │       │       │
    │       │       ├─→ Select Zone/Ward from dropdown
    │       │       │
    │       │       ├─→ Display Jurisdiction Card:
    │       │       │   ├─→ IF "Ward 42":
    │       │       │   │   ├─→ Badge: "MCD - Local Drainage" (Orange)
    │       │       │   │   ├─→ JE Name: Amit Sharma
    │       │       │   │   ├─→ Phone: +91-11-2731-2731 (Clickable)
    │       │       │   │   └─→ Description: "MCD manages local roads..."
    │       │       │   │
    │       │       │   ├─→ IF "Ring Road":
    │       │       │   │   ├─→ Badge: "PWD - Arterial Roads" (Blue)
    │       │       │   │   ├─→ JE Name: Vikram Singh
    │       │       │   │   ├─→ Phone: +91-11-2338-9999 (Clickable)
    │       │       │   │   └─→ Description: "PWD handles major roads..."
    │       │       │   │
    │       │       │   └─→ IF "Vasant Kunj Parks":
    │       │       │       ├─→ Badge: "DDA - Public Spaces" (Purple)
    │       │       │       ├─→ JE Name: Rajesh Kumar
    │       │       │       ├─→ Phone: +91-11-2463-4625 (Clickable)
    │       │       │       └─→ Description: "DDA manages parks..."
    │       │       │
    │       │       ├─→ Click Phone Number
    │       │       │   └─→ Opens tel: link (calls if on mobile)
    │       │       │
    │       │       └─→ Close Modal
    │       │
    │       └─→ Back to Dashboard Button
    │           └─→ Returns to main view
    │
    └─→ END: Resources deployed, jurisdiction confirmed, contacts available

```

### 3. News & Alerts Monitoring Workflow

```
START: User navigates to "News & Alerts" tab
    │
    ├─→ [NewsTab Component Mounts]
    │
    ├─→ [useEffect] Triggered
    │   │
    │   └─→ Call: newsService.fetchFloodNews()
    │       │
    │       ├─→ Check cache (10-minute validity)
    │       │
    │       ├─→ IF cache expired or empty:
    │       │   │
    │       │   ├─→ Call NewsAPI with query:
    │       │   │   "flood OR waterlogging OR monsoon"
    │       │   │
    │       │   ├─→ Receive 20+ news articles
    │       │   │
    │       │   ├─→ For each article, calculate:
    │       │   │   ├─→ severity (critical/high/medium/low)
    │       │   │   ├─→ category (critical/delhi/national)
    │       │   │   └─→ relevance score
    │       │   │
    │       │   ├─→ Cache results + timestamp
    │       │   │
    │       │   └─→ Return transformed data
    │       │
    │       └─→ IF cache valid:
    │           └─→ Return cached articles
    │
    ├─→ [setNews(newsData)] Update state
    │
    ├─→ [Render News UI]
    │   │
    │   ├─→ Search Bar
    │   │   └─→ User types keyword
    │   │       └─→ Filter news in real-time
    │   │
    │   ├─→ Filter Buttons:
    │   │   ├─→ [All News] → Show all articles
    │   │   ├─→ [Critical Alerts] → severity === 'critical'
    │   │   ├─→ [Delhi Specific] → category === 'delhi'
    │   │   └─→ [National] → category === 'national'
    │   │
    │   └─→ News Cards Grid
    │       └─→ For each article:
    │           │
    │           ├─→ Article Image
    │           │
    │           ├─→ Source Badge (Times of India, NDTV, etc.)
    │           │
    │           ├─→ Severity Badge
    │           │   ├─→ CRITICAL: Red badge
    │           │   ├─→ HIGH: Orange badge
    │           │   ├─→ MEDIUM: Yellow badge
    │           │   └─→ LOW: Blue badge
    │           │
    │           ├─→ Title & Description
    │           │
    │           ├─→ Time posted (e.g., "2d ago")
    │           │
    │           ├─→ Click Card
    │           │   └─→ Open full article (external link)
    │           │
    │           └─→ "Read More →" button
    │
    ├─→ Auto-Refresh Every 15 Minutes
    │   └─→ Re-fetch news, keep latest articles
    │
    └─→ END: User stays informed of flood-related news

```

### 4. Map Interaction Workflow

```
START: User views dashboard with FloodMap
    │
    ├─→ [FloodMap Component Mounts]
    │
    ├─→ [useEffect] Initializes Leaflet Map
    │   │
    │   ├─→ Create map instance (center: Delhi)
    │   │
    │   ├─→ Add TileLayer (OpenStreetMap)
    │   │
    │   ├─→ Add GeoJSON Layer (wards)
    │   │   └─→ Color by risk level:
    │   │       ├─→ Green: Low risk
    │   │       ├─→ Yellow: Medium risk
    │   │       └─→ Red: High risk
    │   │
    │   ├─→ Add Marker Cluster (hotspots)
    │   │
    │   └─→ Store mapInstance in MapContext
    │
    ├─→ User Interaction
    │
    ├─→ [CLICK Ward Polygon]
    │   │
    │   ├─→ Leaflet fire click event
    │   │
    │   ├─→ Get ward properties
    │   │
    │   ├─→ Show [WardPopup] at click location
    │   │   │
    │   │   ├─→ Ward Name
    │   │   ├─→ Risk Level (with color)
    │   │   ├─→ Rainfall Data
    │   │   ├─→ Risk Percentage
    │   │   │
    │   │   ├─→ [TimeToFlood Component]
    │   │   │   └─→ Calculates & shows hours to flood
    │   │   │
    │   │   ├─→ [Dispatch Button]
    │   │   │   │
    │   │   │   └─→ ON CLICK:
    │   │   │       ├─→ Show confirmation dialog
    │   │   │       ├─→ Update ward status in DataContext
    │   │   │       ├─→ Mark dispatch timestamp
    │   │   │       ├─→ Update EmergencyResources counter
    │   │   │       └─→ Close popup
    │   │   │
    │   │   └─→ [Close Button]
    │   │       └─→ Close popup
    │   │
    │   └─→ Popup remains until user closes
    │
    ├─→ [ZOOM/PAN Controls]
    │   └─→ User navigates map
    │       └─→ Map adjusts bounds
    │
    ├─→ [MARKER CLICK (Hotspot)]
    │   │
    │   ├─→ Show hotspot details
    │   │
    │   └─→ Highlight ward on map
    │
    ├─→ [LAYER TOGGLE]
    │   │
    │   ├─→ Show/Hide Wards Layer
    │   ├─→ Show/Hide Hotspots Layer
    │   ├─→ Show/Hide Heatmap
    │   └─→ Show/Hide Drainage System
    │
    └─→ END: User can navigate and interact with flood risk data

```

---

## State Management

### DataContext State Structure

```javascript
{
  // Ward GeoJSON data
  wards: [
    {
      type: "Feature",
      properties: {
        name: "Ward 1",
        riskLevel: "High",
        rainfall: 85,
        riskIndex: 78,
        geometry: { ... }
      }
    },
    // ... more wards
  ],

  // Ward status tracking (risk levels)
  wardStatus: {
    "Ward 1": { riskLevel: "High", lastUpdate: timestamp },
    "Ward 2": { riskLevel: "Medium", lastUpdate: timestamp },
    // ... more wards
  },

  // Emergency mode simulation flag
  emergencyMode: false,

  // Selected month for data filtering
  selectedMonth: "July",

  // Hotspots (flood-prone locations)
  hotspots: [
    { name: "Underpass A", lat: 28.6, lng: 77.2, riskScore: 95 },
    // ... more hotspots
  ],

  // Dashboard metrics
  dashboard: {
    totalWards: 104,
    highRiskCount: 12,
    mediumRiskCount: 25,
    averageRisk: 45,
    lastUpdated: timestamp
  },

  // Original unmodified wards (for emergency mode reset)
  originalWards: [ ... ]
}
```

### MapContext State Structure

```javascript
{
  // Leaflet map instance
  mapInstance: leafletMapObject,

  // Selected ward on map
  selectedWard: {
    name: "Ward 42",
    properties: { ... }
  },

  // Map bounds
  mapBounds: {
    north: 28.9,
    south: 28.4,
    east: 77.5,
    west: 76.8
  },

  // Layer control reference
  layerControl: leafletLayerControl,

  // Marker cluster group
  markerCluster: leafletMarkerClusterGroup,

  // Selected feature on map
  selectedFeature: featureObject
}
```

---

## Feature Workflows

### Emergency Mode Toggle Workflow

```
User Action: Toggle "Scenario Mode" button in Header
    │
    ├─→ [Header Component]
    │   └─→ Click Scenario Mode Button
    │
    ├─→ DataContext.setEmergencyMode(!emergencyMode)
    │
    ├─→ [DataContext useEffect] Triggered
    │   │
    │   ├─→ IF emergencyMode === true:
    │   │   │
    │   │   ├─→ For each ward:
    │   │   │   ├─→ Multiply rainfall by 1.8x
    │   │   │   ├─→ Add +30 to risk index
    │   │   │   ├─→ Set riskCategory to "High"
    │   │   │   └─→ Cap at 100
    │   │   │
    │   │   ├─→ Increase resource capacity:
    │   │   │   ├─→ Pumps: 50 → 60
    │   │   │   ├─→ Teams: 12 → 15
    │   │   │   └─→ Vehicles: 8 → 10
    │   │   │
    │   │   └─→ setWards(emergencyWards)
    │   │
    │   └─→ ELSE (emergencyMode === false):
    │       │
    │       ├─→ Restore original ward data
    │       ├─→ Reset resource capacity
    │       └─→ setWards(originalWards)
    │
    ├─→ All components re-render:
    │   ├─→ FloodMap shows more red zones
    │   ├─→ RiskCards update colors
    │   ├─→ AlertSystem shows more alerts
    │   ├─→ EmergencyResources shows increased capacity
    │   └─→ Resource deployment triggers
    │
    └─→ User sees simulated emergency scenario

```

### Month Selection Workflow

```
User Action: Select month from MonthSelector dropdown
    │
    ├─→ [MonthSelector Component]
    │   └─→ User selects "August"
    │
    ├─→ DataContext.setSelectedMonth("August")
    │
    ├─→ [DataContext useEffect] Dependency: selectedMonth
    │   │
    │   ├─→ Call: mcdService.fetchWardData("August")
    │   │
    │   ├─→ Service transforms CSV data for August:
    │   │   ├─→ Read August rainfall from CSV
    │   │   ├─→ Calculate new risk indices
    │   │   ├─→ Merge with ward boundaries (GeoJSON)
    │   │   └─→ Return transformed wards array
    │   │
    │   └─→ setWards(newWardData)
    │       └─→ setOriginalWards(newWardData)
    │
    ├─→ All dependent components update:
    │   ├─→ FloodMap redraws polygons with new colors
    │   ├─→ RiskCards update with new risk values
    │   ├─→ RainfallTrendAnalysis shows August trends
    │   └─→ HistoricalComparison updates comparisons
    │
    └─→ User sees flood data for selected month

```

---

## Component Communication Patterns

### Parent → Child Props

```
App → Header
  • lastUpdate: timestamp

App → HeroSection
  • onReportSubmit: function
  • onEmergencyResourcesClick: function

App → FloodMap
  • onWardSelect: function

App → EmergencyResources
  • onNavigateToOps: function
```

### Global Context Access (useDataContext)

```
Components that consume DataContext:
├─ Dashboard
├─ FloodMap
├─ RiskCards
├─ AlertSystem
├─ EmergencyResources
├─ HotspotsInsights
├─ MonthSelector
└─ EmergencyOperationsDashboard

Components that consume MapContext:
├─ FloodMap
└─ WardPopup
```

### Local Storage Communication

```
ReportWaterlogging → localStorage
  Save: JSON.stringify(waterlogReports)
  Key: 'waterlogReports'

Read from localStorage:
  • EmergencyOperationsDashboard (to count reports)
  • Analytics components (future)
```

---

## API Endpoints Used

### External Services

```
1. NewsAPI
   GET https://newsapi.org/v2/everything?q=flood&sortBy=publishedAt
   Returns: News articles about flooding

2. Weather API (IMD)
   GET /api/weather/rainfall
   Returns: Real-time rainfall data

3. Map Tiles
   GET https://tile.openstreetmap.org/{z}/{x}/{y}.png
   Returns: Map background imagery

4. Local CSV Data
   GET /data/north_rainfall.csv
   GET /data/south_rainfall.csv
   Returns: Historical rainfall data

5. GeoJSON Files
   GET /data/Delhi_Wards.geojson
   GET /data/Delhi_Boundary.geojson
   Returns: Ward boundaries for mapping
```

---

## Error Handling & Edge Cases

### Data Loading States

```
1. Loading → Render spinner/skeleton
2. Error → Show error message + retry button
3. Success → Display data
4. Empty → Show "No data available" message
```

### Ward Data Validation

```
IF wardData missing required fields:
  → Use fallback values
  → Log warning
  → Continue rendering

IF GeoJSON invalid:
  → Show error toast
  → Hide map layer
  → Allow other features to work
```

---

## Performance Optimizations

```
1. Lazy Load Components
   └─ React.lazy() for News, Hotspots, HowItWorks views

2. Memoization
   └─ React.memo() for frequently re-rendered cards

3. Data Caching
   └─ 10-minute cache for NewsAPI results
   └─ Local CSV data caching

4. Map Optimization
   └─ Defer heavy map calculations
   └─ Use marker clustering for performance

5. Debouncing
   └─ Search input debouncing in NewsTab
   └─ Map zoom calculations debounced
```

---

## Summary

This smart FloodWatch application is a comprehensive flood management system with:

- **26+ React Components** for various features
- **2 Context Providers** for global state management
- **Multiple Services** for data fetching and processing
- **Real-time Data Visualization** with Leaflet & Chart.js
- **Emergency Response Dashboard** for resource management
- **News Integration** with newsAPI for real-time alerts
- **Jurisdiction Lookup** for government agency coordination
- **Citizen Reporting** for water-logging incidents
- **Predictive Analytics** for flood risk forecasting

The architecture follows React best practices with separation of concerns, proper state management, and reusable components.

---

**Last Updated:** January 2, 2026  
**Version:** 2.0  
**Status:** Production Ready
