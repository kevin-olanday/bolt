"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, ChevronUp, ChevronDown, BarChart3, Users, CheckCircle, XCircle, X, Eye, ArrowLeft, Zap, List, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { TopNav } from "@/components/top-nav"
import Link from "next/link"

interface BizOpsApp {
  id: string
  category: "Application" | "Infrastructure"
  asset_plan_id: number
  cmdb_asset_name: string
  uam_plan_asset_name: string
  arl_tier: "ARL0" | "ARL1" | "ARL2" | "ARL3" | "ARLU" | "NULL"
  business_group: string
  asset_id: string
  sailpoint_name: string
  request_channel: "Request/" | "Email" | "Sailpoint (CAR/LCM)"
  revocation_channel: string
  supported_by_am: boolean
  supported_by_ac: boolean
  last_modified_date: string | null
  last_refresh_date: string | null
}

type SortField = keyof BizOpsApp
type SortDirection = "asc" | "desc"

interface ColumnConfig {
  key: SortField
  label: string
  visible: boolean
}

export default function BizOpsAppListPage() {
  const [apps, setApps] = useState<BizOpsApp[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("cmdb_asset_name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

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
      setLoading(true)
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
      setLoading(false)
    }
  }

  // Get unique values for filter dropdowns
  const uniqueBusinessGroups = useMemo(() => {
    return [...new Set(apps.map((app) => app.business_group))].sort()
  }, [apps])

  // Filter and search logic
  const filteredApps = useMemo(() => {
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
        searchTerm === "" || searchFields.some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))

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
  }, [apps, searchTerm, arlTierFilter, supportedByAmFilter, supportedByAcFilter, businessGroupFilter])

  // Sort logic
  const sortedApps = useMemo(() => {
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
  }, [filteredApps, sortField, sortDirection])

  // Statistics
  const stats = useMemo(() => {
    const supportedByAmCount = filteredApps.filter((app) => app.supported_by_am).length
    const supportedByAcCount = filteredApps.filter((app) => app.supported_by_ac).length

    return {
      totalCount: filteredApps.length,
      supportedByAmCount,
      supportedByAcCount,
    }
  }, [filteredApps])

  const exportAppsToCsv = () => {
    const visible = columns.filter((c) => c.visible)
    const header = visible.map((c) => c.label)
    const toCsvValue = (value: unknown) => {
      const raw = value ?? ""
      const str = String(raw)
      const needsQuoting = /[",\n]/.test(str)
      const escaped = str.replace(/"/g, '""')
      return needsQuoting ? `"${escaped}"` : escaped
    }
    const rows = sortedApps.map((app) =>
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
    a.download = `bizops-apps-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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

  const hasActiveFilters =
    searchTerm !== "" ||
    arlTierFilter !== "all" ||
    supportedByAmFilter !== "all" ||
    supportedByAcFilter !== "all" ||
    businessGroupFilter !== "all"

  // Function to toggle column visibility
  const toggleColumnVisibility = (columnKey: SortField) => {
    setColumns((prev) => prev.map((col) => (col.key === columnKey ? { ...col, visible: !col.visible } : col)))
  }

  // Function to get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible)
  }, [columns])

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
        <TopNav />

        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-slate-900/40 border-b dark:border-slate-800">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <List className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-3xl font-bold text-foreground">BizOps App List</h1>
              </div>
              <p className="mt-2 text-muted-foreground">Directory of business applications and infrastructure</p>
            </div>
          </div>

          <div className="max-w-screen-xl mx-auto px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading BizOps Apps...</div>
            </div>
          </div>
        </div>

        <footer className="bg-gray-100 dark:bg-gray-900/50 border-t mt-auto">
          <div className="max-w-screen-xl mx-auto px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Zap className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">© 2024 BOLT. All rights reserved.</span>
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

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
      <TopNav />

      <div className="bg-gray-50 dark:bg-slate-900/40 border-b dark:border-slate-800">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <List className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-3xl font-bold text-foreground">BizOps App List</h1>
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
                      {columns.map((column) => (
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
                onClick={exportAppsToCsv}
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 bg-transparent dark:text-indigo-400 dark:border-indigo-900 dark:hover:bg-indigo-950/30"
              >
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </Button>
            </div>
          </div>

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
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.totalCount}</p>
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.supportedByAmCount}</p>
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{stats.supportedByAcCount}</p>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                        <SelectItem value="all">All ARL Tiers</SelectItem>
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
                        {uniqueBusinessGroups.map((group) => (
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
                      {visibleColumns.map(({ key, label }) => (
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
                    {sortedApps.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        {visibleColumns.map(({ key }) => (
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
                              <span className="text-sm text-gray-900 dark:text-slate-100">{formatDate(app.last_modified_date)}</span>
                            )}
                            {key === "last_refresh_date" && (
                              <span className="text-sm text-gray-900 dark:text-slate-100">{formatDate(app.last_refresh_date)}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedApps.length === 0 && (
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
              <span className="text-sm font-medium text-muted-foreground">© 2024 BOLT. All rights reserved.</span>
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
