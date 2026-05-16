import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, ComposedChart,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { DailySummary } from "../types"

interface Props {
  data: DailySummary[]
}

export function DemandPulse({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    requests: d.totalRequests,
    users: d.uniqueUsers,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Demand Pulse by Day</CardTitle>
        <div className="text-xs text-muted-foreground">Daily request volume with active user breadth</div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Bar yAxisId="left" dataKey="requests" fill="oklch(0.546 0.245 262)" radius={[4, 4, 0, 0]} name="Requests" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="users"
              stroke="#F97316"
              strokeWidth={2}
              name="Active Users"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
