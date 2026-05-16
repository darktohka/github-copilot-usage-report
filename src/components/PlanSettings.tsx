import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Select } from "./ui/select"
import type { Plan } from "../types"

interface Props {
  plan: Plan
  promotional: boolean
  onPlanChange: (p: Plan) => void
  onPromotionalChange: (v: boolean) => void
  userCount: number
  totalRequests: number
  totalAIC: number
}

const PLAN_LABELS = { business: "Copilot Business", enterprise: "Copilot Enterprise" }
const INCLUDED_PRS = { business: 300, enterprise: 1500 }
const INCLUDED_AICS = { business: 1900, enterprise: 3900 }
const PROMO_AICS = { business: 3000, enterprise: 7000 }

export function PlanSettings({ plan, promotional, onPlanChange, onPromotionalChange, userCount, totalRequests, totalAIC }: Props) {
  const perUserPrs = INCLUDED_PRS[plan]
  const perUserAics = promotional ? PROMO_AICS[plan] : INCLUDED_AICS[plan]
  const freePRsPool = userCount * perUserPrs
  const freeAICsPool = userCount * perUserAics
  const totalAICs = totalAIC / 0.01
  const oldOverage = Math.max(0, totalRequests - freePRsPool)
  const newOverageCredits = Math.max(0, totalAICs - freeAICsPool)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Billing Plan Settings</CardTitle>
        <div className="text-xs text-muted-foreground">Configure plan type to project old vs new system costs</div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Plan</label>
            <Select value={plan} onChange={(e) => onPlanChange(e.target.value as Plan)}>
              <option value="business">{PLAN_LABELS.business}</option>
              <option value="enterprise">{PLAN_LABELS.enterprise}</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Promotional period (Jun–Sep 2026)</label>
            <Select value={promotional ? "yes" : "no"} onChange={(e) => onPromotionalChange(e.target.value === "yes")}>
              <option value="no">No (standard credits)</option>
              <option value="yes">Yes (+ extra credits)</option>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5 ml-auto">
            <div>{userCount} users × {perUserPrs} free PRs = <strong>{freePRsPool.toLocaleString()}</strong> pooled PRs</div>
            <div>{userCount} users × {perUserAics} AICs = <strong>{freeAICsPool.toLocaleString()}</strong> pooled AICs</div>
            <div>Old overage: <strong>{oldOverage.toLocaleString()}</strong> requests @ $0.04 = <strong>${(oldOverage * 0.04).toFixed(2)}</strong></div>
            <div>New overage: <strong>{newOverageCredits.toFixed(0)}</strong> AICs @ $0.01 = <strong>${(newOverageCredits * 0.01).toFixed(2)}</strong></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
