export type Plan = "business" | "enterprise"

export interface UsageRecord {
  date: string
  username: string
  product: string
  sku: string
  model: string
  quantity: number
  unit_type: string
  applied_cost_per_quantity: number
  gross_amount: number
  discount_amount: number
  net_amount: number
  exceeds_quota: string
  total_monthly_quota: number
  organization: string
  cost_center_name: string
  aic_quantity: number
  aic_gross_amount: number
}

export interface DailySummary {
  date: string
  totalRequests: number
  uniqueUsers: number
  grossAmount: number
  netAmount: number
  aicQuantity: number
  modelCounts: Record<string, number>
}

export interface ModelSummary {
  model: string
  totalRequests: number
  grossAmount: number
  netAmount: number
  aicAmount: number
  aicQuantity: number
  userCounts: Record<string, number>
}

export interface QuotaSummary {
  username: string
  totalRequests: number
  monthlyQuota: number
  utilization: number
}

export interface WeekdaySummary {
  weekday: string
  totalRequests: number
  grossAmount: number
}

export interface UserSummary {
  username: string
  totalRequests: number
  grossAmount: number
  netAmount: number
  modelCounts: Record<string, number>
}
