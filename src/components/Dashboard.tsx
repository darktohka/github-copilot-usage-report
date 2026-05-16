import { useState, useMemo } from "react";
import type { UsageRecord, Plan } from "../types";
import {
  buildDailySummaries,
  buildModelSummaries,
  buildUserSummaries,
  buildQuotaSummaries,
  buildWeekdaySummaries,
} from "../lib/xlsx-parser";
import { StatsCards } from "./StatsCards";
import { ChartRequestsPerModel } from "./ChartRequestsPerModel";
import { ChartRequestsPerUser } from "./ChartRequestsPerUser";
import { ChartDailyModelTrend } from "./ChartDailyModelTrend";
import { ChartModelPie } from "./ChartModelPie";
import { ChartDailyActiveUsers } from "./ChartDailyActiveUsers";
import { ChartUserModelMatrix } from "./ChartUserModelMatrix";
import { ChartCostAnalysis } from "./ChartCostAnalysis";
import { ModelTimeSeries } from "./ModelTimeSeries";
import { DemandPulse } from "./DemandPulse";
import { QuotaPressure } from "./QuotaPressure";
import { WeekdayCadence } from "./WeekdayCadence";
import { AICImpactTable } from "./AICImpactTable";
import { PlanSettings } from "./PlanSettings";
import { OldVsNewBilling } from "./OldVsNewBilling";
import { SavingsOptimizer } from "./SavingsOptimizer";

interface DashboardProps {
  records: UsageRecord[];
}

export function Dashboard({ records }: DashboardProps) {
  const [plan, setPlan] = useState<Plan>("business");
  const [promotional, setPromotional] = useState(false);

  const daily = useMemo(() => buildDailySummaries(records), [records]);
  const models = useMemo(() => buildModelSummaries(records), [records]);
  const users = useMemo(() => buildUserSummaries(records), [records]);
  const quota = useMemo(() => buildQuotaSummaries(records), [records]);
  const weekday = useMemo(() => buildWeekdaySummaries(daily), [daily]);

  return (
    <div className="space-y-6">
      <StatsCards daily={daily} models={models} users={users} quota={quota} />

      <PlanSettings
        plan={plan}
        promotional={promotional}
        onPlanChange={setPlan}
        onPromotionalChange={setPromotional}
        userCount={users.length}
        totalRequests={daily.reduce((s, d) => s + d.totalRequests, 0)}
        totalAIC={models.reduce((s, m) => s + m.aicAmount, 0)}
      />

      <div className="grid grid-cols-1 gap-6">
        <OldVsNewBilling
          models={models}
          plan={plan}
          promotional={promotional}
          userCount={users.length}
        />
      </div>

      <SavingsOptimizer
        plan={plan}
        promotional={promotional}
        totalAICCredits={models.reduce((s, m) => s + m.aicAmount, 0) / 0.01}
        userCount={users.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DemandPulse data={daily} />
        <ChartDailyActiveUsers data={daily} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartRequestsPerModel data={models} />
        <ChartModelPie data={models} />
      </div>

      <ChartDailyModelTrend daily={daily} models={models} />

      <ModelTimeSeries daily={daily} models={models} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartRequestsPerUser data={users} />
        <ChartUserModelMatrix users={users} models={models} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuotaPressure data={quota} />
        <WeekdayCadence data={weekday} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AICImpactTable models={models} />
        <ChartCostAnalysis models={models} daily={daily} />
      </div>
    </div>
  );
}
