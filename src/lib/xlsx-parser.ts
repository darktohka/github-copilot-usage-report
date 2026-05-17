import * as XLSX from "xlsx"
import type { UsageRecord, DailySummary, ModelSummary, UserSummary, QuotaSummary, WeekdaySummary } from "../types"

function normalizeModel(model: string): string {
  return model.replace(/^Auto: /, "")
}

function parseCSVLine(line: string): string[] {
  const parts: string[] = []
  let current = ""
  let inQuotes = false
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes
    } else if (ch === "," && !inQuotes) {
      parts.push(current.replace(/^"|"$/g, "").trim())
      current = ""
    } else {
      current += ch
    }
  }
  parts.push(current.replace(/^"|"$/g, "").trim())
  return parts
}

export function parseXLSX(file: ArrayBuffer): UsageRecord[] {
  const wb = XLSX.read(file, { type: "array" })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const ref = ws["!ref"]
  if (!ref) return []
  const range = XLSX.utils.decode_range(ref)
  const records: UsageRecord[] = []

  for (let R = 1; R <= range.e.r; R++) {
    const cell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })]
    if (!cell) continue
    const parts = parseCSVLine(String(cell.v))
    if (parts.length < 4) continue
    const r: UsageRecord = {
      date: parts[0] || "",
      username: parts[1] || "",
      product: parts[2] || "",
      sku: parts[3] || "",
      model: normalizeModel(parts[4] || ""),
      quantity: parseFloat(parts[5]) || 0,
      unit_type: parts[6] || "",
      applied_cost_per_quantity: parseFloat(parts[7]) || 0,
      gross_amount: parseFloat(parts[8]) || 0,
      discount_amount: parseFloat(parts[9]) || 0,
      net_amount: parseFloat(parts[10]) || 0,
      exceeds_quota: parts[11] || "",
      total_monthly_quota: parseFloat(parts[12]) || 0,
      organization: parts[13] || "",
      cost_center_name: parts[14] || "",
      aic_quantity: parseFloat(parts[15]) || 0,
      aic_gross_amount: parseFloat(parts[16]) || 0,
    }
    records.push(r)
  }

  return records
}

export function buildDailySummaries(records: UsageRecord[]): DailySummary[] {
  const byDate = new Map<string, UsageRecord[]>()
  for (const r of records) {
    const arr = byDate.get(r.date) || []
    arr.push(r)
    byDate.set(r.date, arr)
  }
  return Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, recs]) => {
      const users = new Set(recs.map((r) => r.username))
      const modelCounts: Record<string, number> = {}
      for (const r of recs) {
        modelCounts[r.model] = (modelCounts[r.model] || 0) + r.quantity
      }
      return {
        date,
        totalRequests: recs.reduce((s, r) => s + r.quantity, 0),
        uniqueUsers: users.size,
        grossAmount: recs.reduce((s, r) => s + r.gross_amount, 0),
        netAmount: recs.reduce((s, r) => s + r.net_amount, 0),
        aicQuantity: recs.reduce((s, r) => s + r.aic_quantity, 0),
        modelCounts,
      }
    })
}

export function buildModelSummaries(records: UsageRecord[]): ModelSummary[] {
  const byModel = new Map<string, UsageRecord[]>()
  for (const r of records) {
    const arr = byModel.get(r.model) || []
    arr.push(r)
    byModel.set(r.model, arr)
  }
  return Array.from(byModel.entries())
    .sort(([, a], [, b]) => b.reduce((s, r) => s + r.quantity, 0) - a.reduce((s, r) => s + r.quantity, 0))
    .map(([model, recs]) => {
      const userCounts: Record<string, number> = {}
      for (const r of recs) {
        userCounts[r.username] = (userCounts[r.username] || 0) + r.quantity
      }
      return {
        model,
        totalRequests: recs.reduce((s, r) => s + r.quantity, 0),
        grossAmount: recs.reduce((s, r) => s + r.gross_amount, 0),
        netAmount: recs.reduce((s, r) => s + r.net_amount, 0),
        aicAmount: recs.reduce((s, r) => s + r.aic_gross_amount, 0),
        aicQuantity: recs.reduce((s, r) => s + r.aic_quantity, 0),
        userCounts,
      }
    })
}

export function buildUserSummaries(records: UsageRecord[]): UserSummary[] {
  const byUser = new Map<string, UsageRecord[]>()
  for (const r of records) {
    const arr = byUser.get(r.username) || []
    arr.push(r)
    byUser.set(r.username, arr)
  }
  return Array.from(byUser.entries())
    .sort(([, a], [, b]) => b.reduce((s, r) => s + r.quantity, 0) - a.reduce((s, r) => s + r.quantity, 0))
    .map(([username, recs]) => {
      const modelCounts: Record<string, number> = {}
      for (const r of recs) {
        modelCounts[r.model] = (modelCounts[r.model] || 0) + r.quantity
      }
      return {
        username,
        totalRequests: recs.reduce((s, r) => s + r.quantity, 0),
        grossAmount: recs.reduce((s, r) => s + r.gross_amount, 0),
        netAmount: recs.reduce((s, r) => s + r.net_amount, 0),
        modelCounts,
      }
    })
}

export function buildQuotaSummaries(records: UsageRecord[]): QuotaSummary[] {
  const byUser = new Map<string, { totalRequests: number; monthlyQuota: number }>()
  for (const r of records) {
    const existing = byUser.get(r.username) || { totalRequests: 0, monthlyQuota: 0 }
    existing.totalRequests += r.quantity
    if (r.total_monthly_quota > existing.monthlyQuota) {
      existing.monthlyQuota = r.total_monthly_quota
    }
    byUser.set(r.username, existing)
  }
  return Array.from(byUser.entries())
    .filter(([, u]) => u.monthlyQuota > 0)
    .map(([username, u]) => ({
      username,
      totalRequests: u.totalRequests,
      monthlyQuota: u.monthlyQuota,
      utilization: +(u.totalRequests / u.monthlyQuota * 100).toFixed(1),
    }))
    .sort((a, b) => b.utilization - a.utilization)
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function buildWeekdaySummaries(daily: DailySummary[]): WeekdaySummary[] {
  const byWeekday = new Map<number, { totalRequests: number; grossAmount: number }>()
  for (const d of daily) {
    const dow = new Date(d.date).getDay()
    const existing = byWeekday.get(dow) || { totalRequests: 0, grossAmount: 0 }
    existing.totalRequests += d.totalRequests
    existing.grossAmount += d.grossAmount
    byWeekday.set(dow, existing)
  }
  return Array.from(byWeekday.entries())
    .sort(([a], [b]) => a - b)
    .map(([dow, v]) => ({
      weekday: WEEKDAYS[dow],
      totalRequests: v.totalRequests,
      grossAmount: v.grossAmount,
    }))
}
