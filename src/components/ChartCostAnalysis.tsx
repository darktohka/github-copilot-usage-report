import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  Line, ComposedChart,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MODEL_PALETTE, lightenHex } from "../lib/colors"
import type { ModelSummary, DailySummary } from "../types"

interface Props {
  models: ModelSummary[]
  daily: DailySummary[]
}

export function ChartCostAnalysis({ models, daily }: Props) {
  const [logScale, setLogScale] = useState(false)
  const [grossLogScale, setGrossLogScale] = useState(false)
  const modelCostData = models
    .map((m) => ({
      model: m.model,
      label: m.model,
      cost: +m.grossAmount.toFixed(2),
    }))
    .sort((a, b) => b.cost - a.cost)

  const dailyCost = daily.map((d) => ({
    date: d.date.slice(5),
    cost: +d.grossAmount.toFixed(2),
    avgCostPerUser: d.uniqueUsers > 0 ? +(d.grossAmount / d.uniqueUsers).toFixed(3) : 0,
  }))

  const aicData = models
    .map((m, i) => ({
      model: m.model,
      label: m.model,
      current: +m.grossAmount.toFixed(2),
      aic: +m.aicAmount.toFixed(2),
      color: MODEL_PALETTE[i % MODEL_PALETTE.length],
    }))
    .sort((a, b) => b.current - a.current)

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Gross Amount per Model (previous billing model)</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setGrossLogScale(!grossLogScale)}>
              {grossLogScale ? "Linear" : "Log"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(200, modelCostData.length * 40)}>
            <BarChart data={modelCostData} margin={{ bottom: 80, left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 11 }} scale={grossLogScale ? "log" : "auto"} domain={grossLogScale ? [0.01, 'auto'] : [0, 'auto']} allowDataOverflow={grossLogScale} />
              <Tooltip
                contentStyle={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.922 0.01 260)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Gross"]}
              />
              <Bar
                dataKey="cost"
                radius={[4, 4, 0, 0]}
                label={{ position: "top", fontSize: 9, formatter: (v) => `$${Number(v).toFixed(0)}` }}
              >
                {modelCostData.map((_, i) => (
                  <Cell key={i} fill={MODEL_PALETTE[i % MODEL_PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">AIC Cost Projection by Model</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogScale(!logScale)}
            >
              {logScale ? "Linear" : "Log"}
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">Current billing vs projected usage-based (AIC) cost - grouped by model</div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={Math.max(200, aicData.length * 40)}>
            <BarChart data={aicData} margin={{ bottom: 80, left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 11 }} scale={logScale ? "log" : "auto"} domain={logScale ? [0.01, 'auto'] : [0, 'auto']} allowDataOverflow={logScale} />
              <Tooltip
                contentStyle={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.922 0.01 260)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name === "current" ? "Current" : "AIC Projected"]}
              />
              <Bar dataKey="current" name="current" radius={[4, 4, 0, 0]}>
                {aicData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
              <Bar dataKey="aic" name="aic" radius={[4, 4, 0, 0]}>
                {aicData.map((d, i) => (
                  <Cell key={i} fill={lightenHex(d.color, 0.6)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Daily Gross Amount & per Active User</CardTitle>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Total: <strong className="text-foreground">${dailyCost.reduce((s, d) => s + d.cost, 0).toFixed(2)}</strong></span>
            <span>Avg Gross/User: <strong className="text-foreground">${(dailyCost.reduce((s, d) => s + d.avgCostPerUser, 0) / dailyCost.length).toFixed(3)}</strong></span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={dailyCost}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.922 0.01 260)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
              />
              <Bar yAxisId="left" dataKey="cost" fill="oklch(0.577 0.245 27)" radius={[4, 4, 0, 0]} name="Gross Amount" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgCostPerUser"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Avg Gross/User"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  )
}
