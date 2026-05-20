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

function toRecord(row: Record<string, string>): UsageRecord | null {
  const date = row.date || ""
  const username = row.username || ""
  if (!date || !username) return null
  return {
    date,
    username,
    product: row.product || "",
    sku: row.sku || "",
    model: normalizeModel(row.model || ""),
    quantity: parseFloat(row.quantity) || 0,
    unit_type: row.unit_type || "",
    applied_cost_per_quantity: parseFloat(row.applied_cost_per_quantity) || 0,
    gross_amount: parseFloat(row.gross_amount) || 0,
    discount_amount: parseFloat(row.discount_amount) || 0,
    net_amount: parseFloat(row.net_amount) || 0,
    exceeds_quota: row.exceeds_quota || "",
    total_monthly_quota: parseFloat(row.total_monthly_quota) || 0,
    organization: row.organization || "",
    cost_center_name: row.cost_center_name || "",
    aic_quantity: parseFloat(row.aic_quantity) || 0,
    aic_gross_amount: parseFloat(row.aic_gross_amount) || 0,
  }
}

const EXPECTED_HEADERS = [
  "date", "username", "product", "sku", "model",
  "quantity", "unit_type", "applied_cost_per_quantity",
  "gross_amount", "discount_amount", "net_amount",
  "exceeds_quota", "total_monthly_quota", "organization",
  "cost_center_name", "aic_quantity", "aic_gross_amount",
]

function parseMultiColumn(ws: XLSX.WorkSheet): UsageRecord[] {
  const rows = XLSX.utils.sheet_to_json<Record<string, string>>(ws, {
    raw: false,
    defval: "",
  })
  return rows.map(toRecord).filter((r): r is UsageRecord => r !== null)
}

function parseSingleColumn(ws: XLSX.WorkSheet, range: XLSX.Range): UsageRecord[] {
  const records: UsageRecord[] = []
  for (let R = 1; R <= range.e.r; R++) {
    const cell = ws[XLSX.utils.encode_cell({ r: R, c: 0 })]
    if (!cell) continue
    const parts = parseCSVLine(String(cell.v))
    if (parts.length < 4) continue
    const headers = EXPECTED_HEADERS
    const row: Record<string, string> = {}
    for (let i = 0; i < headers.length; i++) {
      row[headers[i]] = parts[i] || ""
    }
    const r = toRecord(row)
    if (r) records.push(r)
  }
  return records
}

export function parseXLSX(file: ArrayBuffer): UsageRecord[] {
  const wb = XLSX.read(file, { type: "array" })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const ref = ws["!ref"]
  if (!ref) return []
  const range = XLSX.utils.decode_range(ref)

  if (range.e.c > 0) {
    return parseMultiColumn(ws)
  }
  return parseSingleColumn(ws, range)
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
