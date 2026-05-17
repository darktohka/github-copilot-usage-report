import { useMemo } from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { DailySummary } from "../types"

interface Props {
  data: DailySummary[]
}

export function ChartAICCumulative({ data }: Props) {
  const chartData = useMemo(() => {
    const result: { date: string; aicQuantity: number; cumulative: number }[] = []
    let cum = 0
    for (const d of data) {
      cum += d.aicQuantity
      result.push({
        date: d.date.slice(5),
        aicQuantity: d.aicQuantity,
        cumulative: cum,
      })
    }
    return result
  }, [data])

  const totalAICs = chartData.length > 0 ? chartData[chartData.length - 1].cumulative : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Summed AICs Used Over Time</CardTitle>
        <div className="text-xs text-muted-foreground">
          Cumulative AIC credits consumed - total: {totalAICs.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="aicCumGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.577 0.245 27)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.577 0.245 27)" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              formatter={(value, name) => {
                if (name === "cumulative") return [Number(value).toLocaleString(), "Cumulative AICs"]
                return [Number(value).toLocaleString(), "Daily AICs"]
              }}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="oklch(0.577 0.245 27)"
              fill="url(#aicCumGradient)"
              strokeWidth={2}
              name="cumulative"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}