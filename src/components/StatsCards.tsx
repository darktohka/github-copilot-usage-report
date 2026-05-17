import { Card, CardContent } from "./ui/card";
import type {
  DailySummary,
  ModelSummary,
  UserSummary,
  QuotaSummary,
  Plan,
} from "../types";

const INCLUDED_AICS = { business: 1900, enterprise: 3900 } as const;
const PROMO_AICS = { business: 3000, enterprise: 7000 } as const;

interface StatsCardsProps {
  daily: DailySummary[];
  models: ModelSummary[];
  users: UserSummary[];
  quota: QuotaSummary[];
  plan: Plan;
  promotional: boolean;
}

export function StatsCards({
  daily,
  models,
  users,
  quota,
  plan,
  promotional,
}: StatsCardsProps) {
  const totalRequests = daily.reduce((s, d) => s + d.totalRequests, 0);
  const avgDaily = totalRequests / daily.length;

  const utilizations = quota.map((q) => q.utilization).sort((a, b) => a - b);
  const avgUtil = utilizations.length
    ? utilizations.reduce((s, v) => s + v, 0) / utilizations.length
    : 0;
  const medianUtil = utilizations.length
    ? utilizations.length % 2 === 0
      ? (utilizations[utilizations.length / 2 - 1] +
          utilizations[utilizations.length / 2]) /
        2
      : utilizations[Math.floor(utilizations.length / 2)]
    : 0;

  const aboveQuota = quota.filter((q) => q.utilization >= 100);
  const belowQuota = quota.filter((q) => q.utilization < 100);
  const sumQuotaAbove = aboveQuota.reduce((s, q) => s + q.utilization, 0);
  const sumQuotaBelow = belowQuota.reduce((s, q) => s + q.utilization, 0);
  const usersAboveQuota = aboveQuota.length;
  const pctAboveQuota =
    quota.length > 0 ? (usersAboveQuota / quota.length) * 100 : 0;
  const quotaRatio = sumQuotaBelow > 0 ? sumQuotaAbove / sumQuotaBelow : 0;
  const quotaRatioLabel =
    quotaRatio >= 1
      ? `${quotaRatio.toFixed(1)}x higher`
      : `${(1 / quotaRatio).toFixed(1)}x lower`;

  const perUserAics = promotional ? PROMO_AICS[plan] : INCLUDED_AICS[plan];
  const pooledAICs = users.length * perUserAics;
  const usedAICs = models.reduce((s, m) => s + m.aicQuantity, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Total Requests</p>
          <p className="text-base font-bold">
            {totalRequests.toLocaleString()}
          </p>
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
          <p className="text-base font-bold truncate" title={models[0]?.model}>
            {models[0]?.model}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Top User</p>
          <p
            className="text-base font-bold truncate"
            title={users[0]?.username}
          >
            {users[0]?.username}
          </p>
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
          <p className="text-xs text-muted-foreground">
            Median Quota Utilization
          </p>
          <p className="text-base font-bold">{medianUtil.toFixed(1)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Sum Quotas ≥ 100%</p>
          <p className="text-base font-bold">
            {sumQuotaAbove.toLocaleString()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Sum Quotas &lt; 100%</p>
          <p className="text-base font-bold">
            {sumQuotaBelow.toLocaleString()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Users Above Quota</p>
          <p className="text-base font-bold">{usersAboveQuota}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Quota Overusage Ratio</p>
          <p className="text-base font-bold">{quotaRatioLabel} vs. underuse</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">% Users Above Quota</p>
          <p className="text-base font-bold">{pctAboveQuota.toFixed(1)}%</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Pooled AICs</p>
          <p className="text-base font-bold">{pooledAICs.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <p className="text-xs text-muted-foreground">Used AICs</p>
          <p className="text-base font-bold">{usedAICs.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
