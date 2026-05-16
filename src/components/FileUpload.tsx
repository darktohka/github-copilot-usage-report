import { useCallback, useRef, useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "./ui/button"

interface FileUploadProps {
  onFile: (data: ArrayBuffer) => void
}

export function FileUpload({ onFile }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.match(/\.(xlsx|xls|csv)$/i)) return
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result instanceof ArrayBuffer) {
          onFile(e.target.result)
        }
      }
      reader.readAsArrayBuffer(file)
    },
    [onFile]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-12 transition-colors cursor-pointer ${
        dragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
    >
      <Upload className="h-8 w-8 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">Drop your report here or click to browse</p>
        <p className="text-xs text-muted-foreground mt-1">Supports .xlsx, .xls, .csv</p>
      </div>
      <Button variant="secondary" size="sm" type="button">
        Select File
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />
    </div>
  )
}
