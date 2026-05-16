import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { MODEL_PALETTE } from "../lib/colors"
import type { ModelSummary } from "../types"

interface Props {
  data: ModelSummary[]
}

export function ChartModelPie({ data }: Props) {
  const top = data.slice(0, 10)
  const others = data.slice(10).reduce((s, m) => s + m.totalRequests, 0)
  const chartData = others > 0
    ? [...top.map((m) => ({ name: m.model, value: m.totalRequests })), { name: "Others", value: others }]
    : top.map((m) => ({ name: m.model, value: m.totalRequests }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Model Usage Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={MODEL_PALETTE[i % MODEL_PALETTE.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(value, name) => [Number(value).toFixed(1), name]}
            />
            <Legend wrapperStyle={{ fontSize: 10 }} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
