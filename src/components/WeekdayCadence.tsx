import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Line, ComposedChart,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { WeekdaySummary } from "../types"

interface Props {
  data: WeekdaySummary[]
}

export function WeekdayCadence({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Weekday Cadence</CardTitle>
        <div className="text-xs text-muted-foreground">Request intensity and gross by weekday</div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis dataKey="weekday" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(value, name) =>
                name === "Gross Amount"
                  ? [`$${Number(value).toFixed(2)}`, name]
                  : [Number(value).toFixed(0), name]
              }
            />
            <Bar yAxisId="left" dataKey="totalRequests" fill="oklch(0.546 0.245 262)" radius={[4, 4, 0, 0]} name="Requests" />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="grossAmount"
              stroke="#22C55E"
              strokeWidth={2}
              name="Gross Amount"
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
