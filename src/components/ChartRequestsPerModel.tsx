import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { MODEL_PALETTE } from "../lib/colors"
import type { ModelSummary } from "../types"

interface Props {
  data: ModelSummary[]
}

export function ChartRequestsPerModel({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Requests Per Model</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 32)}>
          <BarChart data={data} layout="vertical" margin={{ left: 120 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="model"
              tick={{ fontSize: 11 }}
              width={110}
              tickFormatter={(v) => (v.length > 14 ? v.slice(0, 14) + "..." : v)}
            />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(value) => [Number(value).toFixed(1), "Requests"]}
            />
            <Bar
              dataKey="totalRequests"
              radius={[0, 4, 4, 0]}
              label={{ position: "right", fontSize: 10, formatter: (v) => Number(v).toFixed(0) }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={MODEL_PALETTE[i % MODEL_PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
