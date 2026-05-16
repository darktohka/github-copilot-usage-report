# GitHub Copilot Usage Report Dashboard

An interactive dashboard for analyzing GitHub Copilot premium request usage data from exported XLSX reports.

Built with React, TypeScript, Vite, Tailwind CSS v4, and Recharts.

[Try it now!](https://copilot-usage.tohka.us)

## Features

- **File Upload** - Drop or browse for `.xlsx`, `.xls`, or `.csv` usage reports
- **Summary Stats** - Total requests, daily average, active users, top model/user, quota utilization
- **Billing Plan Comparison** - Toggle Business vs Enterprise and promotional vs standard credit pools to compare old (per-request overage) vs new (per-AIC overage) billing
- **Plan Recommendation** - Automatically recommends Business or Enterprise based on lowest projected cost
- **Demand Pulse** - Daily request volume overlaid with active user count
- **Daily Active Users** - Bar chart of unique users per day
- **Requests per Model** - Horizontal bar chart sorted by volume
- **Model Distribution** - Pie chart showing share of requests by model
- **Daily Model Trend** - Stacked bar chart of top 8 models over time
- **Model Time Series** - Line chart per model across the report period
- **Requests per User** - Horizontal bar of top users
- **User vs Model Matrix** - Heatmap showing which users use which models
- **Quota Pressure** - Quota utilization per user (sorted by pressure)
- **Weekday Cadence** - Request volume by day of week
- **AIC Impact Table** - Per-model attributed inference cost breakdown
- **Cost Analysis** - Gross vs net cost per model

## Usage

```bash
npm install
npm run dev
```

Open the app, drop in your GitHub Copilot `PremiumRequestUsageReport` XLSX file, and explore the visualizations.

### Build

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 19**, **TypeScript 6**
- **Vite 8**
- **Tailwind CSS v4** (with `@tailwindcss/vite`)
- **Recharts** for charting
- **SheetJS (xlsx)** for Excel parsing
- **Lucide React** for icons

## How It Works

The app parses the first sheet of an XLSX file exported from the GitHub Copilot billing report. Each row represents a usage event with fields like date, username, model, quantity, cost, quota, and AIC (attributed inference cost). The data is grouped and summarized into several views:

- **DailySummary** - request volume, unique users, costs, model breakdown per day
- **ModelSummary** - total requests, costs, and AIC per model
- **UserSummary** - total requests and costs per user
- **QuotaSummary** - quota utilization per user
- **WeekdaySummary** - request patterns across days of the week

The billing comparison models the old system (per-request overage at $0.04) versus the new system (per-AIC credit overage at $0.01), with configurable plan type and promotional credit periods.
