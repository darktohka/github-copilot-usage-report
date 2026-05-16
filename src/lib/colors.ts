export const MODEL_PALETTE = [
  "#4F46E5", "#7C3AED", "#EC4899", "#EF4444", "#F97316",
  "#EAB308", "#22C55E", "#14B8A6", "#06B6D4", "#3B82F6",
  "#8B5CF6", "#D946EF", "#F43F5E", "#F59E0B", "#84CC16",
  "#10B981", "#0EA5E9", "#6366F1",
]

export function lightenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.floor((255 - ((num >> 16) & 0xff)) * amount))
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.floor((255 - ((num >> 8) & 0xff)) * amount))
  const b = Math.min(255, (num & 0xff) + Math.floor((255 - (num & 0xff)) * amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
}
