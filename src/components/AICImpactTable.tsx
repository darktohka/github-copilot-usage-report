import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { MODEL_PALETTE } from "../lib/colors"
import type { ModelSummary } from "../types"

interface Props {
  models: ModelSummary[]
}

export function AICImpactTable({ models }: Props) {
  const rows = models
    .map((m, i) => {
      const current = m.grossAmount
      const aic = m.aicAmount
      const increase = aic - current
      const pct = current > 0 ? ((aic - current) / current) * 100 : aic > 0 ? Infinity : 0
      return {
        model: m.model,
        color: MODEL_PALETTE[i % MODEL_PALETTE.length],
        current,
        aic,
        increase,
        pct,
      }
    })
    .sort((a, b) => b.pct - a.pct)

  const totCurrent = rows.reduce((s, r) => s + r.current, 0)
  const totAic = rows.reduce((s, r) => s + r.aic, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">AIC Cost Impact by Model</CardTitle>
        <div className="text-xs text-muted-foreground">
          How much more each model will cost under usage-based (AIC) billing
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2 font-medium">Model</th>
              <th className="text-right p-2 font-medium">Current</th>
              <th className="text-right p-2 font-medium">AIC Projected</th>
              <th className="text-right p-2 font-medium">$ Increase</th>
              <th className="text-right p-2 font-medium">% Increase</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.model} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                <td className="p-2">
                  <span className="inline-block w-2 h-2 rounded-sm mr-2 align-middle" style={{ background: r.color }} />
                  {r.model}
                </td>
                <td className="p-2 text-right font-mono">${r.current.toFixed(2)}</td>
                <td className="p-2 text-right font-mono">${r.aic.toFixed(2)}</td>
                <td className={`p-2 text-right font-mono ${r.increase > 0 ? "text-destructive" : "text-green-600"}`}>
                  {r.increase >= 0 ? "+" : ""}${r.increase.toFixed(2)}
                </td>
                <td className={`p-2 text-right font-mono ${r.pct > 0 ? "text-destructive" : "text-green-600"}`}>
                  {r.pct === Infinity ? "∞" : `${r.pct >= 0 ? "+" : ""}${r.pct.toFixed(1)}%`}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 font-semibold">
              <td className="p-2">Total</td>
              <td className="p-2 text-right font-mono">${totCurrent.toFixed(2)}</td>
              <td className="p-2 text-right font-mono">${totAic.toFixed(2)}</td>
              <td className="p-2 text-right font-mono text-destructive">+${(totAic - totCurrent).toFixed(2)}</td>
              <td className="p-2 text-right font-mono text-destructive">
                +{totCurrent > 0 ? ((totAic - totCurrent) / totCurrent * 100).toFixed(1) : "∞"}%
              </td>
            </tr>
          </tfoot>
        </table>
      </CardContent>
    </Card>
  )
}
