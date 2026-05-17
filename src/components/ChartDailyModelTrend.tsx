import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MODEL_PALETTE } from "../lib/colors"
import type { DailySummary, ModelSummary } from "../types"

interface Props {
  daily: DailySummary[]
  models: ModelSummary[]
}

export function ChartDailyModelTrend({ daily, models }: Props) {
  const [showAll, setShowAll] = useState(false)
  const topModels = (showAll ? models : models.slice(0, 8)).map((m) => m.model)
  const chartData = daily.map((d) => {
    const row: Record<string, string | number> = { date: d.date.slice(5) }
    for (const m of topModels) {
      row[m] = d.modelCounts[m] || 0
    }
    return row
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Daily Request Breakdown by Model {showAll ? `(${models.length})` : "(Top 8)"}</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show top 8" : "Show all"}
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
            {topModels.map((m, i) => (
              <Bar
                key={m}
                dataKey={m}
                stackId="a"
                fill={MODEL_PALETTE[i % MODEL_PALETTE.length]}
                radius={i === 0 ? [4, 4, 0, 0] : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
