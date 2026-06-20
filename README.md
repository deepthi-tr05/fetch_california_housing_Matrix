# 🏠 California Housing Data Explorer

> An interactive statistical analysis and visualization dashboard built with **React + Vite + TypeScript + Tailwind CSS**. Explore the California Housing dataset through a rich, dark-themed UI featuring correlation heatmaps, pair plots, distribution charts, and more.

Live Demo

[View Live Demo](https://fetch-california-housing-matrix-943.vercel.app/)

## 📸 Features

| Tab | Description |
|-----|-------------|
| 🔥 **Correlation Heatmap** | Interactive Pearson correlation matrix with hover tooltips and color-coded cells |
| 📊 **Pair Plot** | Pairwise scatter plots — select any 2–5 features to compare |
| 📈 **Distributions** | Per-feature histograms with mean, std deviation, min, median, max |
| 🔍 **Scatter Explorer** | Fully customizable scatter plot with quartile color-coding |
| 📋 **Statistics** | Comprehensive descriptive stats: count, mean, std, Q1, Q3, IQR, skewness |

### Dashboard Highlights

- **Insight Cards** — top 4 strongest feature correlations shown on the home view
- **Responsive Layout** — works on desktop, tablet, and mobile
- **Dark glassmorphism** UI with ambient gradient effects and micro-animations
- **Live indicator** showing sample count and feature count

---

## 🧰 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 7.x | Build tool & dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Recharts | 3.x | Charts and visualizations |
| Lucide React | 1.x | Icons |
| clsx / tailwind-merge | latest | Conditional className utilities |

---

## 📦 Dataset

This dashboard is based on the **California Housing Dataset** derived from the **1990 US Census**. Each row represents one block group with the following features:

| Feature | Description |
|---------|-------------|
| `MedInc` | Median income (tens of thousands of USD) |
| `HouseAge` | Median house age in block group (years) |
| `AveRooms` | Average number of rooms per household |
| `AveBedrms` | Average number of bedrooms per household |
| `Population` | Block group population |
| `AveOccup` | Average household occupancy |
| `Latitude` | Block group latitude |
| `Longitude` | Block group longitude |
| `MedHouseVal` | **Target** — Median house value (hundreds of thousands of USD) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later
- **npm** v9 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/DeepthiTRGowda/fetch_california_housing_Matrix.git
cd fetch_california_housing_Matrix

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

The build uses `vite-plugin-singlefile` to bundle everything into a single self-contained HTML file in `dist/`.

---

## 📁 Project Structure

```
fetch_california_housing_Matrix/
├── index.html                    # HTML entry point
├── package.json                  # Project metadata & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite + plugins configuration
├── .gitignore                    # Git ignore rules
└── src/
    ├── main.tsx                  # React root mount
    ├── App.tsx                   # Main app + tab navigation
    ├── index.css                 # Global styles + Tailwind import
    ├── data/
    │   └── californiaHousing.ts  # Dataset, feature names, correlation utils
    └── components/
        ├── Heatmap.tsx           # Correlation heatmap with hover
        ├── PairPlot.tsx          # Multi-feature pairwise scatter grid
        ├── DistributionCharts.tsx # Histogram per feature
        ├── ScatterDetail.tsx     # Interactive scatter with axis selectors
        └── StatsSummary.tsx      # Descriptive statistics table
```

---

## 🖼️ How It Works

1. **Data Layer** (`src/data/californiaHousing.ts`)  
   - Contains a representative 200-record sample of the California Housing dataset  
   - Exports `getDataRows()`, `featureNames`, `featureDescriptions`, and `computeCorrelationMatrix()`

2. **App Shell** (`src/App.tsx`)  
   - Computes the correlation matrix once using `useMemo`  
   - Derives the top 4 correlation pairs for the insight cards  
   - Handles tab navigation between all 5 views

3. **Components** (`src/components/`)  
   - Each component is self-contained and receives `data` / `features` / `matrix` props  
   - All charts powered by **Recharts** with custom dark-themed tooltips

---

## 🎨 Design System

- **Background**: Deep slate gradient (`from-slate-950 via-slate-900 to-slate-950`)
- **Primary accent**: Cyan (`#06b6d4`)
- **Secondary accents**: Purple, Amber, Emerald
- **Glassmorphism**: `backdrop-blur` + semi-transparent surfaces
- **Typography**: Inter (system-ui fallback)
- **Animations**: CSS `animate-pulse`, scale transforms on hover

---

## 👩‍💻 Author

**Deepthi T R Gowda**  
📧 deepthitrgowda@gmail.com  
🐙 [GitHub](https://github.com/DeepthiTRGowda)

---

## 📄 License

This project is created for **educational and demonstration purposes**.  
Feel free to fork, adapt, and build upon it.
