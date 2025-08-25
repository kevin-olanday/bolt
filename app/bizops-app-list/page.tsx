"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  List,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  Settings,
  Database,
  Grid3X3,
  Zap,
  ChevronUp,
  ChevronDown,
  BarChart3,
  CheckCircle,
  Users,
  X,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { TopNav } from "@/components/top-nav"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

interface BizOpsApp {
  id: string
  category: string
  asset_plan_id: string
  cmdb_asset_name: string
  uam_plan_asset_name: string
  arl_tier: string
  business_group: string
  asset_id: string
  sailpoint_name: string
  request_channel: string
  revocation_channel: string
  supported_by_am: boolean
  supported_by_ac: boolean
  last_modified_date: string
  last_refresh_date: string
}

type SortField = keyof BizOpsApp
type SortDirection = "asc" | "desc"

interface ColumnConfig {
  key: keyof BizOpsApp
  label: string
  visible: boolean
}

// Loading component that will be shown while the page loads
function BizOpsAppListLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 border-b-2 border-indigo-500/30 shadow-xl">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-indigo-400/30">
                <List className="h-5 w-5 text-indigo-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                  BizOps App List
                </h1>
                <p className="text-sm text-indigo-200 leading-none tracking-wider uppercase mt-1">
                  Directory of business applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="max-w-screen-xl mx-auto px-8 py-16">
        <div className="text-center">
          {/* Loading Animation */}
          <div className="relative mb-8">
            {/* Central Loading Icon */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-indigo-200/30 rounded-full animate-pulse" />
              
              {/* Spinning Ring */}
              <div className="absolute inset-2 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
              
              {/* Central Icon */}
              <div className="absolute inset-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Grid3X3 className="h-8 w-8 text-white" />
              </div>
              
              {/* Floating App Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <Database className="h-3 w-3 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Loading Application Directory
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Scanning infrastructure and compiling application inventory...
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="mt-12 max-w-md mx-auto space-y-4">
            {/* Database Scan */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Database connection established</span>
            </div>
            
            {/* App Discovery */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="text-sm text-slate-700 dark:text-slate-300">Application discovery in progress</span>
            </div>
            
            {/* Metadata Loading */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              <span className="text-sm text-slate-700 dark:text-slate-300">Metadata and permissions loading</span>
            </div>
          </div>

          {/* Branding */}
          <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-700/50">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Powered by <span className="font-semibold text-indigo-600 dark:text-indigo-400">The BASE</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BizOpsAppListPage() {
  const [apps, setApps] = useState<BizOpsApp[]>([])
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [sortField, setSortField] = useState<SortField>("cmdb_asset_name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filters
  const [arlTierFilter, setArlTierFilter] = useState<string>("all")
  const [supportedByAmFilter, setSupportedByAmFilter] = useState<string>("all")
  const [supportedByAcFilter, setSupportedByAcFilter] = useState<string>("all")
  const [businessGroupFilter, setBusinessGroupFilter] = useState<string>("all")

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: "category", label: "Category", visible: true },
    { key: "asset_plan_id", label: "Asset Plan ID", visible: true },
    { key: "cmdb_asset_name", label: "CMDB Asset Name", visible: true },
    { key: "uam_plan_asset_name", label: "UAM Plan Asset Name", visible: true },
    { key: "arl_tier", label: "ARL Tier", visible: true },
    { key: "business_group", label: "Business Group", visible: true },
    { key: "asset_id", label: "Asset ID", visible: false },
    { key: "sailpoint_name", label: "Sailpoint Name", visible: false },
    { key: "request_channel", label: "Request Channel", visible: false },
    { key: "revocation_channel", label: "Revocation Channel", visible: false },
    { key: "supported_by_am", label: "Supported by AM", visible: true },
    { key: "supported_by_ac", label: "Supported by AC", visible: true },
    { key: "last_modified_date", label: "Last Modified", visible: false },
    { key: "last_refresh_date", label: "Last Refresh", visible: false },
  ])

  const supabase = createClient()

  useEffect(() => {
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      setIsRefreshing(true)
      const { data, error } = await supabase
        .from("bizops_apps")
        .select("*")
        .order("cmdb_asset_name", { ascending: true })

      if (error) {
        console.error("Error fetching apps:", error)
        return
      }
      setApps(data || [])
    } catch (error) {
      console.error("Error fetching apps:", error)
    } finally {
      setIsRefreshing(false)
      setIsInitialLoading(false) // Set initial loading to false after first fetch
    }
  }

  // Show loading component only for initial page load
  if (isInitialLoading) {
    return <BizOpsAppListLoading />
  }

  // Only render main content when we have data
  if (!apps || apps.length === 0) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
        <TopNav />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">No Data Available</h2>
            <p className="text-gray-600 dark:text-slate-400">No business applications found in the database.</p>
          </div>
        </div>
      </div>
    )
  }

  // Helper functions that only run when we have data
  const getUniqueBusinessGroups = () => {
    try {
      return [...new Set(apps.map((app) => app.business_group))].sort()
    } catch (error) {
      console.error("Error getting unique business groups:", error)
      return []
    }
  }

  const getFilteredApps = () => {
    try {
      return apps.filter((app) => {
        // Search filter
        const searchFields = [
          app.cmdb_asset_name,
          app.uam_plan_asset_name,
          app.business_group,
          app.asset_id,
          app.sailpoint_name,
          app.revocation_channel,
        ].filter(Boolean)

        const matchesSearch =
          !searchTerm || searchTerm === "" || searchTerm.trim() === "" || searchFields.some((field) => field && typeof field === "string" && field.toLowerCase().includes(searchTerm.toLowerCase()))

        // ARL Tier filter
        const matchesArlTier = arlTierFilter === "all" || app.arl_tier === arlTierFilter

        // Supported by AM filter
        const matchesSupportedByAm =
          supportedByAmFilter === "all" ||
          (supportedByAmFilter === "true" && app.supported_by_am) ||
          (supportedByAmFilter === "false" && !app.supported_by_am)

        // Supported by AC filter
        const matchesSupportedByAc =
          supportedByAcFilter === "all" ||
          (supportedByAcFilter === "true" && app.supported_by_ac) ||
          (supportedByAcFilter === "false" && !app.supported_by_ac)

        // Business Group filter
        const matchesBusinessGroup = businessGroupFilter === "all" || app.business_group === businessGroupFilter

        return matchesSearch && matchesArlTier && matchesSupportedByAm && matchesSupportedByAc && matchesBusinessGroup
      })
    } catch (error) {
      console.error("Error filtering apps:", error)
      return []
    }
  }

  const getSortedApps = (filteredApps: BizOpsApp[]) => {
    try {
      if (!filteredApps || filteredApps.length === 0) return []
      
      return [...filteredApps].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue)
          return sortDirection === "asc" ? comparison : -comparison
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue
        }

        if (typeof aValue === "boolean" && typeof bValue === "boolean") {
          return sortDirection === "asc"
            ? aValue === bValue
              ? 0
              : aValue
                ? 1
                : -1
            : aValue === bValue
              ? 0
              : aValue
                ? -1
              : 1
        }

        return 0
      })
    } catch (error) {
      console.error("Error sorting apps:", error)
      return []
    }
  }

  const getStats = (filteredApps: BizOpsApp[]) => {
    try {
      if (!filteredApps || filteredApps.length === 0) {
        return {
          totalCount: 0,
          supportedByAmCount: 0,
          supportedByAcCount: 0,
        }
      }
      
      const supportedByAmCount = filteredApps.filter((app) => app.supported_by_am).length
      const supportedByAcCount = filteredApps.filter((app) => app.supported_by_ac).length

      return {
        totalCount: filteredApps.length,
        supportedByAmCount,
        supportedByAcCount,
      }
    } catch (error) {
      console.error("Error calculating stats:", error)
      return {
        totalCount: 0,
        supportedByAmCount: 0,
        supportedByAcCount: 0,
      }
    }
  }

  // Get data only when needed (no useMemo hooks that run during initial render)
  const uniqueBusinessGroups = getUniqueBusinessGroups()
  const filteredApps = getFilteredApps()
  const sortedApps = getSortedApps(filteredApps)
  const stats = getStats(filteredApps)
  const visibleColumns = (columns || []).filter((col) => col.visible)

  const exportAppsToCsv = (exportAll: boolean = false) => {
    const dataToExport = exportAll ? apps : filteredApps
    const filename = exportAll ? `bizops-apps-all-${new Date().toISOString().slice(0, 10)}.csv` : `bizops-apps-filtered-${new Date().toISOString().slice(0, 10)}.csv`

    const visible = (columns || []).filter((c) => c.visible)
    const header = visible.map((c) => c.label)
    const toCsvValue = (value: unknown) => {
      const raw = value ?? ""
      const str = String(raw)
      const needsQuoting = /[",\n]/.test(str)
      const escaped = str.replace(/"/g, '""')
      return needsQuoting ? `"${escaped}"` : escaped
    }
    const rows = (dataToExport || []).map((app) =>
      visible.map(({ key }) => {
        const v = (app as any)[key]
        if (typeof v === "boolean") return v ? "Yes" : "No"
        return v ?? ""
      }),
    )
    const csv = [header.join(","), ...rows.map((r) => r.map(toCsvValue).join(","))].join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setIsExportDialogOpen(false)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setArlTierFilter("all")
    setSupportedByAmFilter("all")
    setSupportedByAcFilter("all")
    setBusinessGroupFilter("all")
  }

  const hasActiveFilters = Boolean(
    (searchTerm && typeof searchTerm === "string" && searchTerm.trim() !== "") ||
    arlTierFilter !== "all" ||
    supportedByAmFilter !== "all" ||
    supportedByAcFilter !== "all" ||
    businessGroupFilter !== "all"
  )

  // Function to toggle column visibility
  const toggleColumnVisibility = (columnKey: SortField) => {
    setColumns((prev) => prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col)))
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
      <TopNav />

      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <List className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-foreground">BizOps App List</h1>
                {isRefreshing && (
                  <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground">Directory of business applications and infrastructure</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-screen-xl mx-auto px-8 py-8 space-y-6">
          {/* Header controls */}
          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent dark:text-indigo-400 dark:border-indigo-900 dark:hover:bg-indigo-950/30">
                    <Eye className="w-4 h-4 mr-2" />
                    Columns
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-slate-700 dark:text-slate-300">Show/Hide Columns</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {(columns || []).map((column) => (
                        <div key={column.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={column.key}
                            checked={column.visible}
                            onCheckedChange={() => toggleColumnVisibility(column.key)}
                          />
                          <label
                            htmlFor={column.key}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            {column.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={() => hasActiveFilters ? setIsExportDialogOpen(true) : exportAppsToCsv(false)}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent dark:text-indigo-400 dark:border-indigo-900 dark:hover:bg-indigo-950/30"
              >
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Export Confirmation Dialog */}
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-foreground">Export Options</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <p className="text-base text-muted-foreground leading-relaxed">
                  You have active filters. What would you like to export?
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => exportAppsToCsv(false)}
                    className="justify-start h-14 text-base font-medium border-2 border-indigo-300 text-indigo-600 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all dark:border-indigo-700 dark:text-indigo-400 dark:hover:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-indigo-950"
                    variant="outline"
                  >
                    <Download className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-950" />
                    Export filtered results ({(filteredApps?.length || 0)} apps)
                  </Button>
                  <Button
                    onClick={() => exportAppsToCsv(true)}
                    className="justify-start h-14 text-base font-medium border-2 border-indigo-300 text-indigo-600 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all dark:border-indigo-700 dark:text-indigo-400 dark:hover:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-indigo-950"
                    variant="outline"
                  >
                    <Download className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-950" />
                    Export all apps ({(apps?.length || 0)} apps)
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Statistics Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Total Assets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats?.totalCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Supported by AM</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats?.supportedByAmCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
                    <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-slate-400">Supported by AC</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats?.supportedByAcCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-slate-50 border-slate-200 dark:bg-slate-900/40 dark:border-slate-800">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-slate-300">Search & Filters</h3>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      size="sm"
                      className="text-gray-600 dark:text-slate-300 border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 bg-transparent"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear Filters
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  {/* Search */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-500 w-4 h-4" />
                      <Input
                        placeholder="Search apps..."
                        value={searchTerm || ""}
                        onChange={(e) => setSearchTerm(e.target.value || "")}
                        className="pl-10 bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* ARL Tier Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">ARL Tier</label>
                    <Select value={arlTierFilter} onValueChange={setArlTierFilter}>
                      <SelectTrigger className="bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                        <SelectValue placeholder="ARL Tier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tiers</SelectItem>
                        <SelectItem value="ARL0">ARL0</SelectItem>
                        <SelectItem value="ARL1">ARL1</SelectItem>
                        <SelectItem value="ARL2">ARL2</SelectItem>
                        <SelectItem value="ARL3">ARL3</SelectItem>
                        <SelectItem value="ARLU">ARLU</SelectItem>
                        <SelectItem value="NULL">NULL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Supported by AM Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Supported by AM?</label>
                    <Select value={supportedByAmFilter} onValueChange={setSupportedByAmFilter}>
                      <SelectTrigger className="bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                        <SelectValue placeholder="AM Support" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Apps</SelectItem>
                        <SelectItem value="true">Supported</SelectItem>
                        <SelectItem value="false">Not Supported</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Supported by AC Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Supported by AC?</label>
                    <Select value={supportedByAcFilter} onValueChange={setSupportedByAcFilter}>
                      <SelectTrigger className="bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                        <SelectValue placeholder="AC Support" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Apps</SelectItem>
                        <SelectItem value="true">Supported</SelectItem>
                        <SelectItem value="false">Not Supported</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Business Group Filter */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-slate-400 mb-1">Business Group</label>
                    <Select value={businessGroupFilter} onValueChange={setBusinessGroupFilter}>
                      <SelectTrigger className="bg-white border-gray-200 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
                        <SelectValue placeholder="Business Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {(uniqueBusinessGroups || []).map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900/60 dark:border-slate-800">
                    <tr>
                      {(visibleColumns || []).map(({ key, label }) => (
                        <th
                          key={key}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          onClick={() => handleSort(key as SortField)}
                        >
                          <div className="flex items-center space-x-1">
                            <span>{label}</span>
                            {getSortIcon(key as SortField)}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-slate-900/30 divide-y divide-slate-200 dark:divide-slate-800">
                    {(sortedApps || []).map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        {(visibleColumns || []).map(({ key }) => (
                          <td key={key} className="px-4 py-3 whitespace-nowrap">
                            {key === "category" && (
                              <Badge
                                variant={app.category === "Application" ? "default" : "secondary"}
                                className={
                                  app.category === "Application"
                                    ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                    : "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200"
                                }
                              >
                                {app.category}
                              </Badge>
                            )}
                            {key === "asset_plan_id" && <span className="text-sm text-gray-900 dark:text-slate-100">{app.asset_plan_id}</span>}
                            {key === "cmdb_asset_name" && (
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{app.cmdb_asset_name}</span>
                            )}
                            {key === "uam_plan_asset_name" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{app.uam_plan_asset_name}</span>
                            )}
                            {key === "arl_tier" && (
                              <Badge variant="outline" className="text-xs dark:border-slate-700">
                                {app.arl_tier}
                              </Badge>
                            )}
                            {key === "business_group" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{app.business_group}</span>
                            )}
                            {key === "asset_id" && <span className="text-sm text-gray-900 dark:text-slate-100">{app.asset_id}</span>}
                            {key === "sailpoint_name" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{app.sailpoint_name}</span>
                            )}
                            {key === "request_channel" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{app.request_channel}</span>
                            )}
                            {key === "revocation_channel" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{app.revocation_channel}</span>
                            )}
                            {key === "supported_by_am" &&
                              (app.supported_by_am ? (
                                <CheckCircle className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                              ))}
                            {key === "supported_by_ac" &&
                              (app.supported_by_ac ? (
                                <CheckCircle className="w-5 h-5 text-teal-500 dark:text-teal-400" />
                              ) : (
                                <XCircle className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                              ))}
                            {key === "last_modified_date" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{formatDate(app.last_modified_date || null)}</span>
                            )}
                            {key === "last_refresh_date" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{formatDate(app.last_refresh_date || null)}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {(sortedApps?.length || 0) === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-slate-400">No apps found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="bg-gray-100 dark:bg-gray-900/50 border-t mt-auto">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">© 2024 The BASE. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors hover:underline">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors hover:underline">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
