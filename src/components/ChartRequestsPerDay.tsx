import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { DailySummary } from "../types"

interface Props {
  data: DailySummary[]
}

export function ChartRequestsPerDay({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    requests: d.totalRequests,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Requests Per Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
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
              formatter={(value) => [Number(value).toFixed(2), "Requests"]}
            />
            <Bar dataKey="requests" fill="oklch(0.546 0.245 262)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
