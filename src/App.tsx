import { useState, useCallback } from "react"
import { FileUpload } from "./components/FileUpload"
import { Dashboard } from "./components/Dashboard"
import { parseXLSX } from "./lib/xlsx-parser"
import type { UsageRecord } from "./types"

export default function App() {
  const [records, setRecords] = useState<UsageRecord[] | null>(null)

  const handleFile = useCallback((data: ArrayBuffer) => {
    const parsed = parseXLSX(data)
    setRecords(parsed)
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">GitHub Copilot Request Usage Report</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive dashboard for analyzing Copilot premium request usage
        </p>
      </header>

      {!records ? (
        <FileUpload onFile={handleFile} />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {records.length} records loaded
            </p>
            <button
              onClick={() => setRecords(null)}
              className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
            >
              Load different file
            </button>
          </div>
          <Dashboard records={records} />
        </>
      )}
    </div>
  )
}
