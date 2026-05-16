import { Card, CardContent } from "./ui/card"
import type { DailySummary, ModelSummary, UserSummary, QuotaSummary } from "../types"

interface StatsCardsProps {
  daily: DailySummary[]
  models: ModelSummary[]
  users: UserSummary[]
  quota: QuotaSummary[]
}

export function StatsCards({ daily, models, users, quota }: StatsCardsProps) {
  const totalRequests = daily.reduce((s, d) => s + d.totalRequests, 0)
  const avgDaily = totalRequests / daily.length

  const utilizations = quota.map((q) => q.utilization).sort((a, b) => a - b)
  const avgUtil = utilizations.length
    ? utilizations.reduce((s, v) => s + v, 0) / utilizations.length
    : 0
  const medianUtil = utilizations.length
    ? utilizations.length % 2 === 0
      ? (utilizations[utilizations.length / 2 - 1] + utilizations[utilizations.length / 2]) / 2
      : utilizations[Math.floor(utilizations.length / 2)]
    : 0

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Total Requests</p>
          <p className="text-base font-bold">{totalRequests.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Avg Requests / Day</p>
          <p className="text-base font-bold">{avgDaily.toFixed(0)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Active Users</p>
          <p className="text-base font-bold">{users.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Days in Report</p>
          <p className="text-base font-bold">{daily.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Top Model</p>
          <p className="text-base font-bold truncate" title={models[0]?.model}>{models[0]?.model}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Top User</p>
          <p className="text-base font-bold truncate" title={users[0]?.username}>{users[0]?.username}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Avg Quota Utilization</p>
          <p className="text-base font-bold">{avgUtil.toFixed(1)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Median Quota Utilization</p>
          <p className="text-base font-bold">{medianUtil.toFixed(1)}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
