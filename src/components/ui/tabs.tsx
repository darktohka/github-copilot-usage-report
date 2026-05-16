import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (v: string) => void }
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
Tabs.displayName = "Tabs"

interface TabsContextType {
  value: string
  onValueChange: (v: string) => void
}
const TabsContext = React.createContext<TabsContextType | null>(null)

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    const isActive = ctx?.value === value
    return (
      <button
        ref={ref}
        role="tab"
        data-state={isActive ? "active" : "inactive"}
        onClick={() => ctx?.onValueChange(value)}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          isActive && "bg-background text-foreground shadow",
          className
        )}
        {...props}
      />
    )
  }
)
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    if (ctx?.value !== value) return null
    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state="active"
        className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = "TabsContent"

function TabsRoot({ defaultValue, value, onValueChange, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string; value?: string; onValueChange?: (v: string) => void }) {
  const [tab, setTab] = React.useState(defaultValue || "")
  const ctx: TabsContextType = {
    value: value !== undefined ? value : tab,
    onValueChange: onValueChange || setTab,
  }
  return (
    <TabsContext.Provider value={ctx}>
      <div {...props}>{children}</div>
    </TabsContext.Provider>
  )
}

export { TabsRoot as Tabs, TabsList, TabsTrigger, TabsContent }
