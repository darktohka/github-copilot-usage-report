import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { DailySummary } from "../types"

interface Props {
  data: DailySummary[]
}

export function ChartDailyActiveUsers({ data }: Props) {
  const chartData = data.map((d) => ({
    date: d.date.slice(5),
    users: d.uniqueUsers,
    requests: d.totalRequests,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Daily Active Users</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <defs>
              <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="users" stroke="#7C3AED" fill="url(#userGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
