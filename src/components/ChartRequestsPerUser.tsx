import { useState } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import type { UserSummary } from "../types"

interface Props {
  data: UserSummary[]
}

export function ChartRequestsPerUser({ data }: Props) {
  const [showAll, setShowAll] = useState(false)
  const limit = showAll ? data.length : 15
  const chartData = data.slice(0, limit).map((u) => ({
    username: u.username,
    requests: u.totalRequests,
  }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Top {limit} Users by Requests</CardTitle>
        <Button variant="outline" size="sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show top 15" : "Show all"}
        </Button>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 36)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="username" tick={{ fontSize: 11 }} width={90} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="requests"
              fill="oklch(0.715 0.143 215)"
              radius={[0, 4, 4, 0]}
              label={{ position: "right", fontSize: 10, formatter: (v) => Number(v).toFixed(0) }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
