import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import type { ModelSummary, Plan } from "../types";

const PLAN_FLAT_FEE = { business: 19, enterprise: 39 };
const INCLUDED_PRS = { business: 300, enterprise: 1500 };
const INCLUDED_AICS = { business: 1900, enterprise: 3900 };
const PROMO_AICS = { business: 3000, enterprise: 7000 };

interface Props {
  models: ModelSummary[];
  plan: Plan;
  promotional: boolean;
  userCount: number;
}

function toCredits(amount: number) {
  return amount / 0.01;
}

export function OldVsNewBilling({
  models,
  plan,
  promotional,
  userCount,
}: Props) {
  const flatFee = PLAN_FLAT_FEE[plan];
  const perUserPrs = INCLUDED_PRS[plan];
  const perUserAics = promotional ? PROMO_AICS[plan] : INCLUDED_AICS[plan];

  const totalRequests = models.reduce((s, m) => s + m.totalRequests, 0);
  const totalAIC = models.reduce((s, m) => s + m.aicAmount, 0);

  const freePRsPool = userCount * perUserPrs;
  const freeAICsPool = userCount * perUserAics;
  const totalAICredits = toCredits(totalAIC);

  const oldOverageRequests = Math.max(0, totalRequests - freePRsPool);
  const oldOverageCost = oldOverageRequests * 0.04;
  const oldSubscriptionCost = userCount * flatFee;
  const oldTotal = oldSubscriptionCost + oldOverageCost;

  const newOverageCredits = Math.max(0, totalAICredits - freeAICsPool);
  const newOverageCost = newOverageCredits * 0.01;
  const newSubscriptionCost = userCount * flatFee;
  const newTotal = newSubscriptionCost + newOverageCost;

  const breakdown = [
    {
      name: "Subscription",
      old: oldSubscriptionCost,
      new: newSubscriptionCost,
    },
    { name: "Overage", old: oldOverageCost, new: newOverageCost },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            Old vs New: Total Monthly Cost
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            {plan === "business" ? "Copilot Business" : "Copilot Enterprise"} -{" "}
            {promotional ? "Promotional credits" : "Standard credits"}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Old System Total</p>
              <p className="text-xl font-bold">${oldTotal.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                ${flatFee}/user × {userCount} users + $
                {oldOverageCost.toFixed(2)} overage
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">New System Total</p>
              <p className="text-xl font-bold">${newTotal.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                ${flatFee}/user × {userCount} users + $
                {newOverageCost.toFixed(2)} overage
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Difference</p>
              <p
                className={`text-xl font-bold ${newTotal > oldTotal ? "text-destructive" : "text-green-600"}`}
              >
                {newTotal >= oldTotal ? "+" : ""}$
                {(newTotal - oldTotal).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Change</p>
              <p
                className={`text-xl font-bold ${newTotal > oldTotal ? "text-destructive" : "text-green-600"}`}
              >
                {oldTotal > 0
                  ? `${((newTotal / oldTotal) * 100 - 100).toFixed(1)}%`
                  : "N/A"}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={breakdown}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.922 0.01 260)"
              />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.922 0.01 260)",
                  borderRadius: "8px",
                  fontSize: 12,
                }}
                formatter={(value, name) => [`$${Number(value).toFixed(2)}`, name]}
              />
              <Bar
                dataKey="old"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                name="Old System"
              />
              <Bar
                dataKey="new"
                fill="#F97316"
                radius={[4, 4, 0, 0]}
                name="New System"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <PlanRecommendation
        currentPlan={plan}
        userCount={userCount}
        totalRequests={totalRequests}
        totalAICredits={totalAICredits}
      />
    </>
  );
}

function planCost(plan: Plan, userCount: number, totalRequests: number, totalAICredits: number, promo: boolean) {
  const fee = PLAN_FLAT_FEE[plan]
  const prs = INCLUDED_PRS[plan]
  const aics = promo ? PROMO_AICS[plan] : INCLUDED_AICS[plan]
  const sub = userCount * fee
  const oldOverage = Math.max(0, totalRequests - userCount * prs) * 0.04
  const newOverage = Math.max(0, totalAICredits - userCount * aics) * 0.01
  return { sub, oldOverage, newOverage, oldTotal: sub + oldOverage, newTotal: sub + newOverage }
}

function PlanRecommendation({
  currentPlan, userCount, totalRequests, totalAICredits,
}: {
  currentPlan: Plan; userCount: number; totalRequests: number; totalAICredits: number;
}) {
  const periods = [
    { label: "Promotional Period (Jun–Sep 2026)", promo: true },
    { label: "Standard Period", promo: false },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Should I Switch Plans?</CardTitle>
        <div className="text-xs text-muted-foreground">Compare Business vs Enterprise - old and new billing</div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {periods.map((period) => {
            const bizC = planCost("business", userCount, totalRequests, totalAICredits, period.promo)
            const entC = planCost("enterprise", userCount, totalRequests, totalAICredits, period.promo)
            const entCheaperOrEq = entC.newTotal <= bizC.newTotal
            const recommended = entCheaperOrEq ? "enterprise" : "business"
            const recommendedLabel = recommended === "business" ? "Business" : "Enterprise"
            const savings = Math.abs(entC.newTotal - bizC.newTotal)

            let reason: string
            if (entCheaperOrEq) {
              reason = `Enterprise costs $${savings.toFixed(2)}/mo ${entC.newTotal < bizC.newTotal ? "less" : "the same"} - always upgrade when there's no cost penalty.`
            } else {
              reason = `Business saves $${savings.toFixed(2)}/mo over Enterprise.`
            }

            return (
              <div key={period.label} className="rounded-lg border p-3 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{period.label}</p>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b text-muted-foreground">
                      <th className="text-left p-1 font-medium">Plan</th>
                      <th className="text-right p-1 font-medium">Sub</th>
                      <th className="text-right p-1 font-medium">Overage</th>
                      <th className="text-right p-1 font-medium">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={currentPlan === "business" ? "font-semibold" : ""}>
                      <td className="p-1">Business</td>
                      <td className="p-1 text-right">${bizC.sub.toFixed(0)}</td>
                      <td className="p-1 text-right">${bizC.newOverage.toFixed(2)}</td>
                      <td className="p-1 text-right">${bizC.newTotal.toFixed(2)}</td>
                    </tr>
                    <tr className={currentPlan === "enterprise" ? "font-semibold" : ""}>
                      <td className="p-1">Enterprise</td>
                      <td className="p-1 text-right">${entC.sub.toFixed(0)}</td>
                      <td className="p-1 text-right">${entC.newOverage.toFixed(2)}</td>
                      <td className="p-1 text-right">${entC.newTotal.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="flex items-center gap-2 pt-1">
                  <span className={`text-lg font-bold ${recommended === currentPlan ? "text-green-600" : "text-destructive"}`}>
                    {recommendedLabel}
                  </span>
                  <span className="text-xs text-muted-foreground">recommended - {reason}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
