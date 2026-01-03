# 🌊 Jal Nivaran (Smart FloodWatch)
### Delhi Municipal Corporation Decision Support System

![Version](https://img.shields.io/badge/Version-2.0-blue) ![Stack](https://img.shields.io/badge/Tech-React%20%7C%20Tailwind%20%7C%20Leaflet-orange) ![Status](https://img.shields.io/badge/Hackathon-Hack4Delhi-green)

**A data-driven, proactive flood management portal designed for the Government of NCT Delhi.**
*Moves urban flood management from "Reactive Response" to "Predictive Planning".*

---

## 🚨 The Problem
Delhi faces recurring water-logging during monsoons, leading to:
1.  **Traffic Paralysis:** Key arterial roads get blocked.
2.  **The "Blame Game":** Citizens don't know if a road belongs to MCD, PWD, or DDA, delaying reports.
3.  **Reactive Action:** Authorities often deploy pumps *after* the street is flooded.

## 💡 The Solution: Jal Nivaran
**Jal Nivaran** is a centralized Command & Control Dashboard that aggregates rainfall data, drainage capacity, and citizen reports to predict flood hotspots *hours before they happen*.

### 🌟 Key Innovations (USPs)
* **🎯 Jurisdiction Resolver:** Instantly identifies which agency (MCD/PWD/DDA) manages a specific ward/road to route alerts correctly.
* **🧠 Predictive Risk Logic:** Uses a weighted formula `(Rainfall × Drainage Deficit) + Historical Data` to color-code risk zones.
* **⚡ Client-Side Resilience:** Built with a "Serverless/Edge" architecture. The dashboard logic runs in the browser, ensuring it works even if central servers face downtime during storms.
* **🛑 Action-First UI:** Officials don't just *see* data; they *act* on it (Dispatch Pumps, Deploy Teams) directly from the map.

---

## 📸 Screenshots

| **Live Risk Map** | **Emergency Ops Dashboard** |
|:---:|:---:|
| ![Map](https://via.placeholder.com/400x200?text=Risk+Map+Screenshot) <br> *Real-time visualization of High-Risk Wards* | ![Ops](https://via.placeholder.com/400x200?text=Ops+Dashboard) <br> *Dispatch pumps and view team status* |

| **Citizen Reporting** | **Jurisdiction Locator** |
|:---:|:---:|
| ![Report](https://via.placeholder.com/400x200?text=Report+Modal) <br> *Crowdsourced data validation* | ![Locator](https://via.placeholder.com/400x200?text=Jurisdiction+Modal) <br> *Finds responsible JE/Agency instantly* |

---

## 🛠️ Tech Stack

* **Frontend Framework:** React.js (Vite)
* **Styling:** Tailwind CSS (Government-grade UI theme)
* **Mapping Engine:** Leaflet.js / React-Leaflet
* **Geospatial Analysis:** Turf.js (Client-side point-in-polygon analysis)
* **Data Persistence:** LocalStorage (for Hackathon demo stability) & JSON Datasets
* **Live News:** RSS Feed Integration (Google News via JSON proxy)

---

## ⚙️ How It Works (The Logic)

The system calculates a **Risk Index (0-100)** for every ward using this formula:

$$Risk Index = (0.4 \times R_{forecast}) + (0.4 \times D_{deficit}) + (0.2 \times C_{complaints})$$

* **$R_{forecast}$:** Rainfall intensity (mm/hr) vs capacity.
* **$D_{deficit}$:** Drainage blockage percentage.
* **$C_{complaints}$:** Verified citizen reports.

**Status Levels:**
* 🟢 **0-39 (Safe):** Routine monitoring.
* 🟠 **40-69 (Warning):** Pre-emptive pump deployment required.
* 🔴 **70-100 (Critical):** Immediate Emergency Response Team dispatch.

---

## 🚀 Installation & Setup

This project uses a **Client-Side Architecture**, so no complex backend setup is required.

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/jal-nivaran.git](https://github.com/your-username/jal-nivaran.git)
    cd jal-nivaran
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Run the Application**
    ```bash
    npm run dev
    # or
    npm start
    ```

4.  **Open in Browser**
    Visit `http://localhost:5173` (or `localhost:3000`) to view the dashboard.

---

## 📂 Project Structure

```bash
src/
├── components/
│   ├── FloodMap.jsx          # Main Leaflet map component
│   ├── WardPopup.jsx         # Action popup for MCD officials
│   ├── JurisdictionModal.jsx # The "MCD vs PWD" resolver
│   ├── EmergencyOps.jsx      # Pump dispatch dashboard
│   └── NewsFeed.jsx          # Live RSS news integration
├── data/
│   ├── Delhi_Wards.geojson   # Geospatial boundaries
│   └── rainfall_data.json    # Historical IMD data for analysis
├── utils/
│   └── riskAlgorithm.js      # The math behind the risk coloring
└── App.jsx                   # Main Landing Page
