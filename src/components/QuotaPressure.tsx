import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { QuotaSummary } from "../types"

interface Props {
  data: QuotaSummary[]
}

export function QuotaPressure({ data }: Props) {
  const top = data.slice(0, 15)
  const maxUtil = Math.max(...top.map((u) => u.utilization), 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quota Pressure</CardTitle>
        <div className="text-xs text-muted-foreground">Top users by monthly quota utilization</div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, top.length * 36)}>
          <BarChart data={top} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.922 0.01 260)" />
            <XAxis type="number" domain={[0, Math.ceil(maxUtil / 10) * 10]} tick={{ fontSize: 11 }} unit="%" />
            <YAxis type="category" dataKey="username" tick={{ fontSize: 11 }} width={90} />
            <Tooltip
              contentStyle={{
                background: "oklch(1 0 0)",
                border: "1px solid oklch(0.922 0.01 260)",
                borderRadius: "8px",
                fontSize: 12,
              }}
              formatter={(value, name) => {
                if (name === "utilization") return [`${value}%`, "Utilization"]
                return [value, name]
              }}
            />
            <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
              {top.map((_, i) => (
                <Cell
                  key={i}
                  fill={top[i].utilization >= 100 ? "#EF4444" : top[i].utilization >= 80 ? "#F97316" : "#22C55E"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
