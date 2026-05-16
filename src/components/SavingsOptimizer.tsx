import { Card, CardContent } from "./ui/card"
import type { Plan } from "../types"

const INCLUDED_AICS = { business: 1900, enterprise: 3900 } as const
const PROMO_AICS = { business: 3000, enterprise: 7000 } as const

interface Props {
  plan: Plan
  totalAICCredits: number
  userCount: number
  promotional: boolean
}

export function SavingsOptimizer({ plan, totalAICCredits, userCount, promotional }: Props) {
  const bizPoolStd = userCount * INCLUDED_AICS.business
  const entPoolStd = userCount * INCLUDED_AICS.enterprise
  const bizPoolPromo = userCount * PROMO_AICS.business
  const entPoolPromo = userCount * PROMO_AICS.enterprise

  if (plan === "business") {
    const upgradeStd = Math.max(0, Math.min(totalAICCredits, entPoolStd) - bizPoolStd) * 0.01
    const upgradePromo = Math.max(0, Math.min(totalAICCredits, entPoolPromo) - bizPoolPromo) * 0.01
    const upgrade = promotional ? upgradePromo : upgradeStd
    const headroom = Math.max(0, entPoolStd - totalAICCredits) * 0.01

    return (
      <Card>
        <CardContent className="p-3 space-y-1">
          <p className="text-xs text-muted-foreground">Upgrade to Enterprise</p>
          <p className={`text-base font-bold ${upgrade > 0 ? "text-green-600" : ""}`}>
            {upgrade > 0
              ? `Save $${upgrade.toFixed(2)}/mo`
              : "$0.00"}
          </p>
          {upgrade > 0 ? (
            <p className="text-xs text-muted-foreground">
              Standard: ${upgradeStd.toFixed(2)} | Promo: ${upgradePromo.toFixed(2)}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Usage within Business pool — no overage to save
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Enterprise AIC headroom: ${headroom.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    )
  }

  const entCostStd = userCount * 39 + Math.max(0, totalAICCredits - entPoolStd) * 0.01
  const bizCostStd = userCount * 19 + Math.max(0, totalAICCredits - bizPoolStd) * 0.01
  const downgradeStd = Math.max(0, entCostStd - bizCostStd)

  const entCostPromo = userCount * 39 + Math.max(0, totalAICCredits - entPoolPromo) * 0.01
  const bizCostPromo = userCount * 19 + Math.max(0, totalAICCredits - bizPoolPromo) * 0.01
  const downgradePromo = Math.max(0, entCostPromo - bizCostPromo)

  const downgrade = promotional ? downgradePromo : downgradeStd

  const headroom = Math.max(0, entPoolStd - totalAICCredits) * 0.01

  return (
    <Card>
      <CardContent className="p-3 space-y-1">
        <p className="text-xs text-muted-foreground">Downgrade to Business</p>
        <p className={`text-base font-bold ${downgrade > 0 ? "text-green-600" : ""}`}>
          {downgrade > 0
            ? `Save $${downgrade.toFixed(2)}/mo`
            : "$0.00"}
        </p>
        {downgrade > 0 ? (
          <p className="text-xs text-muted-foreground">
            Standard: ${downgradeStd.toFixed(2)} | Promo: ${downgradePromo.toFixed(2)}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Enterprise is already optimal
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Unused Enterprise AICs: ${headroom.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  )
}
