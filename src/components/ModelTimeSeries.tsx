import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Select } from "./ui/select"
import { MODEL_PALETTE } from "../lib/colors"
import type { DailySummary, ModelSummary } from "../types"

interface Props {
  daily: DailySummary[]
  models: ModelSummary[]
}

export function ModelTimeSeries({ daily, models }: Props) {
  const [selected, setSelected] = useState("all")
  const topModels = models.slice(0, 10).map((m) => m.model)

  const chartData = daily.map((d) => {
    const row: Record<string, string | number> = { date: d.date.slice(5) }
    if (selected === "all") {
      for (const m of topModels) {
        row[m] = d.modelCounts[m] || 0
      }
    } else {
      row[selected] = d.modelCounts[selected] || 0
    }
    row._total_ = d.totalRequests
    return row
  })

  const lines = selected === "all" ? topModels : [selected]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Model Usage Over Time</CardTitle>
        <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="all">All models (top 10)</option>
          {models.map((m) => (
            <option key={m.model} value={m.model}>{m.model}</option>
          ))}
        </Select>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(value, name) => [Number(value).toFixed(2), name]}
            />
            {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 10 }} />}
            {lines.map((m, i) => (
              <Line
                key={m}
                type="monotone"
                dataKey={m}
                stroke={MODEL_PALETTE[i % MODEL_PALETTE.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
