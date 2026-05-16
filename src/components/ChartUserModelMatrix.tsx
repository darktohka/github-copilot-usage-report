import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import type { UserSummary, ModelSummary } from "../types"

interface Props {
  users: UserSummary[]
  models: ModelSummary[]
}

export function ChartUserModelMatrix({ users, models }: Props) {
  const topUsers = users.slice(0, 20)
  const topModels = models.slice(0, 8).map((m) => m.model)
  const maxVal = Math.max(
    ...topUsers.flatMap((u) => topModels.map((m) => u.modelCounts[m] || 0))
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">User × Model Usage Matrix (Top 20 users, Top 8 models)</CardTitle>
      </CardHeader>
        <CardContent className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-1 sticky left-0 bg-card">User</th>
              {topModels.map((m) => (
                <th key={m} className="p-1 text-right font-medium" title={m}>
                  {m.length > 10 ? m.slice(0, 10) + "..." : m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topUsers.map((u) => (
              <tr key={u.username}>
                <td className="p-1 font-medium sticky left-0 bg-card">{u.username}</td>
                {topModels.map((m) => {
                  const val = u.modelCounts[m] || 0
                  const intensity = maxVal > 0 ? val / maxVal : 0
                  return (
                    <td
                      key={m}
                      className="p-1 text-right"
                      style={{
                        background: `oklch(${0.97 - intensity * 0.25} ${intensity * 0.15} 262)`,
                      }}
                    >
                      {val > 0 ? val.toFixed(0) : "-"}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
