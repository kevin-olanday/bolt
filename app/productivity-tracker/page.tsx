"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  AlertCircle,
  Database,
  Clock,
  Ticket,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
  Zap,
  BarChart3,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { TopNav } from "@/components/top-nav"
import Link from "next/link"

interface ProductivityEntry {
  id: string
  date: string
  activity:
    | "Project"
    | "Request"
    | "Incident"
    | "Change"
    | "Meeting"
    | "Triage"
    | "Collaboration"
    | "Training"
    | "Admin"
  ticket?: string
  details: string
  time_worked: number // Duration in minutes
  notes?: string
  created_at: string
  user_id?: string
}

const activityColors = {
  Project: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Request: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Incident: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Change: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Meeting: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Triage: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Collaboration: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  Training: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  Admin: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
}

const chartColors = {
  Project: "#4f46e5", // indigo (theme primary)
  Request: "#10b981", // green
  Incident: "#ef4444", // red
  Change: "#f97316", // orange
  Meeting: "#8b5cf6", // purple
  Triage: "#eab308", // yellow
  Collaboration: "#14b8a6", // teal
  Training: "#6366f1", // indigo
  Admin: "#6b7280", // gray
}

export default function ProductivityTrackerPage() {
  const [entries, setEntries] = useState<ProductivityEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<ProductivityEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterActivity, setFilterActivity] = useState<string>("all")
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<ProductivityEntry | null>(null)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [sortField, setSortField] = useState<keyof ProductivityEntry>("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [tableExists, setTableExists] = useState<boolean | null>(null)

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    activity: "Project" as
      | "Project"
      | "Request"
      | "Incident"
      | "Change"
      | "Meeting"
      | "Triage"
      | "Collaboration"
      | "Training"
      | "Admin",
    ticket: "",
    details: "",
    time_worked: 60, // Default to 60 minutes
    notes: "",
  })

  const getSupabaseClient = () => {
    try {
      return createClient()
    } catch (error) {
      console.error("[v0] Error creating Supabase client:", error)
      throw new Error("Failed to initialize database connection. Please check your configuration.")
    }
  }

  useEffect(() => {
    checkTableExists()
  }, [])

  useEffect(() => {
    if (tableExists) {
      fetchEntries()
    }
  }, [selectedDate, viewMode, tableExists])

  useEffect(() => {
    filterAndSortEntries()
  }, [entries, searchTerm, filterActivity, sortField, sortDirection])

  const checkTableExists = async () => {
    try {
      console.log("[v0] Checking if productivity_entries table exists")
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("productivity_entries").select("id").limit(1)

      if (error && error.message.includes("Could not find the table")) {
        console.log("[v0] Table does not exist")
        setTableExists(false)
        setError("Database table not found. Please run the setup script to create the productivity_entries table.")
      } else {
        console.log("[v0] Table exists")
        setTableExists(true)
        setError(null)
      }
    } catch (error) {
      console.error("[v0] Error checking table existence:", error)
      setTableExists(false)
      setError("Unable to connect to database. Please check your configuration.")
    } finally {
      setLoading(false)
    }
  }

  const fetchEntries = async () => {
    if (!tableExists) return

    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Fetching entries for", viewMode, selectedDate)
      const supabase = getSupabaseClient()

      let query = supabase.from("productivity_entries").select("*")

      if (viewMode === "day") {
        query = query.eq("date", selectedDate)
      } else if (viewMode === "week") {
        const startOfWeek = new Date(selectedDate)
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(endOfWeek.getDate() + 6)

        query = query
          .gte("date", startOfWeek.toISOString().split("T")[0])
          .lte("date", endOfWeek.toISOString().split("T")[0])
      } else if (viewMode === "month") {
        const startOfMonth = new Date(selectedDate)
        startOfMonth.setDate(1)
        const endOfMonth = new Date(startOfMonth)
        endOfMonth.setMonth(endOfMonth.getMonth() + 1)
        endOfMonth.setDate(0)

        query = query
          .gte("date", startOfMonth.toISOString().split("T")[0])
          .lte("date", endOfMonth.toISOString().split("T")[0])
      }

      const { data, error } = await query.order("date", { ascending: false })

      if (error) {
        console.error("[v0] Database error:", error)
        if (error.message.includes("infinite recursion")) {
          throw new Error("RLS policy recursion detected. Please run the RLS fix script.")
        }
        throw error
      }

      console.log("[v0] Successfully fetched", data?.length || 0, "entries")
      setEntries(data || [])
    } catch (error) {
      console.error("Error fetching entries:", error)
      if (error instanceof Error && error.message.includes("Could not find the table")) {
        setTableExists(false)
        setError("Database table not found. Please run the setup script to create the productivity_entries table.")
      } else if (error instanceof Error && error.message.includes("infinite recursion")) {
        setError(
          "Database policy error detected. Please run the RLS fix script (scripts/033_fix_rls_policies_properly.sql) to resolve this issue.",
        )
      } else {
        setError(`Failed to load productivity entries: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortEntries = () => {
    let filtered = [...entries]

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.ticket?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterActivity !== "all") {
      filtered = filtered.filter((entry) => entry.activity === filterActivity)
    }

    filtered.sort((a, b) => {
      let aValue = a[sortField] as unknown
      let bValue = b[sortField] as unknown

      // Normalize undefined/null values
      if (aValue === undefined || aValue === null) {
        aValue = sortField === "time_worked" ? 0 : ""
      }
      if (bValue === undefined || bValue === null) {
        bValue = sortField === "time_worked" ? 0 : ""
      }

      // Strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
        return 0
      }

      // Numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number)
      }

      // Booleans
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        if (aValue === bValue) return 0
        const aNum = aValue ? 1 : 0
        const bNum = bValue ? 1 : 0
        return sortDirection === "asc" ? aNum - bNum : bNum - aNum
      }

      return 0
    })

    setFilteredEntries(filtered)
  }

  const handleSort = (field: keyof ProductivityEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSubmitEntry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tableExists) {
      alert("Database table not found. Please run the setup script first.")
      return
    }

    try {
      const supabase = getSupabaseClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        alert("You must be logged in to create entries.")
        return
      }

      const { error } = await supabase.from("productivity_entries").insert([
        {
          ...newEntry,
          user_id: user.id,
        },
      ])

      if (error) throw error

      setNewEntry({
        date: new Date().toISOString().split("T")[0],
        activity: newEntry.activity,
        ticket: "",
        details: "",
        time_worked: 60,
        notes: "",
      })

      setIsNewEntryOpen(false)
      fetchEntries()
    } catch (error) {
      console.error("Error creating entry:", error)
      if (error instanceof Error && error.message.includes("Could not find the table")) {
        setTableExists(false)
        setError("Database table not found. Please run the setup script to create the productivity_entries table.")
      } else {
        alert("Failed to save entry. Please try again.")
      }
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("productivity_entries").delete().eq("id", entryId)

      if (error) throw error

      fetchEntries()
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry. Please try again.")
    }
  }

  const handleEditEntry = (entry: ProductivityEntry) => {
    setEditingEntry(entry)
    setIsEditEntryOpen(true)
  }

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEntry) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("productivity_entries")
        .update({
          date: editingEntry.date,
          activity: editingEntry.activity,
          ticket: editingEntry.ticket,
          details: editingEntry.details,
          time_worked: editingEntry.time_worked,
          notes: editingEntry.notes,
        })
        .eq("id", editingEntry.id)

      if (error) throw error

      setIsEditEntryOpen(false)
      setEditingEntry(null)
      fetchEntries()
    } catch (error) {
      console.error("Error updating entry:", error)
      alert("Failed to update entry. Please try again.")
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours === 0) return `${remainingMinutes}m`
    if (remainingMinutes === 0) return `${hours}h`
    return `${hours}h ${remainingMinutes}m`
  }

  const navigateDate = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)

    if (viewMode === "day") {
      currentDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (viewMode === "week") {
      currentDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else if (viewMode === "month") {
      currentDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    }

    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const uniqueProjects = [...new Set(entries.map((entry) => entry.activity).filter(Boolean))]
  const uniqueTickets = [...new Set(entries.map((entry) => entry.ticket).filter(Boolean))]

  const exportEntriesToCsv = (exportAll: boolean = false) => {
    const dataToExport = exportAll ? entries : filteredEntries
    const filename = exportAll ? `productivity-entries-all-${new Date().toISOString().slice(0, 10)}.csv` : `productivity-entries-filtered-${new Date().toISOString().slice(0, 10)}.csv`

    const headerLabels = [
      "Date",
      "Activity",
      "Ticket",
      "Details",
      "Duration (minutes)",
      "Notes",
    ]
    const toCsvValue = (value: unknown) => {
      const raw = value ?? ""
      const str = String(raw)
      const needsQuoting = /[",\n]/.test(str)
      const escaped = str.replace(/"/g, '""')
      return needsQuoting ? `"${escaped}"` : escaped
    }
    const rows = dataToExport.map((e) => [
      e.date,
      e.activity,
      e.ticket ?? "",
      e.details,
      e.time_worked,
      e.notes ?? "",
    ])
    const csv = [headerLabels.join(","), ...rows.map((r) => r.map(toCsvValue).join(","))].join("\n")
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

  const hasActiveFilters = searchTerm || filterActivity !== "all"

  const calculateStats = () => {
    const ticketCount = filteredEntries.filter((entry) => entry.ticket && entry.ticket.trim() !== "").length
    const totalDuration = filteredEntries.reduce((sum, entry) => sum + entry.time_worked, 0)
    const totalEntries = filteredEntries.length

    const activityCounts = filteredEntries.reduce(
      (acc, entry) => {
        acc[entry.activity] = (acc[entry.activity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const chartData = Object.entries(activityCounts).map(([activity, count]) => ({
      name: activity,
      value: count,
      color: chartColors[activity as keyof typeof chartColors],
    }))

    return { ticketCount, totalDuration, totalEntries, activityCounts, chartData }
  }

  const stats = calculateStats()

  if (tableExists === false) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <TopNav />

        <div className="flex-1">
          <div className="bg-gray-50 dark:bg-gray-900/20 border-b">
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
                <BarChart3 className="h-6 w-6 text-indigo-600" />
                <h1 className="text-3xl font-bold text-foreground">Productivity Tracker</h1>
              </div>
              <p className="mt-2 text-muted-foreground">Track and manage your daily work activities</p>
            </div>
          </div>

          <div className="max-w-screen-xl mx-auto px-8 py-12">
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-foreground mb-4">Database Setup Required</h2>
                <p className="text-muted-foreground mb-6">
                  The productivity_entries table doesn't exist in your database. Please run the setup script to create
                  it.
                </p>

                <Alert className="mb-6 text-left">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Setup Instructions:</strong>
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                      <li>Go to the Scripts section in your v0 project</li>
                      <li>
                        Run the script:{" "}
                        <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">
                          scripts/012_update_productivity_schema_activity.sql
                        </code>
                      </li>
                      <li>Refresh this page once the script completes</li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Button onClick={() => window.location.reload()} className="mr-4">
                  Refresh Page
                </Button>
                <Button variant="outline" onClick={() => checkTableExists()}>
                  Check Again
                </Button>
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

  const getDateDisplayText = () => {
    const date = new Date(selectedDate)

    if (viewMode === "day") {
      return date.toLocaleDateString()
    } else if (viewMode === "week") {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(endOfWeek.getDate() + 6)
      return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`
    } else if (viewMode === "month") {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />

      <div className="bg-gray-50 dark:bg-gray-900/20 border-b">
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
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            <h1 className="text-3xl font-bold text-foreground">Productivity Tracker</h1>
          </div>
          <p className="mt-2 text-muted-foreground">Track and manage your daily work activities</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-screen-xl mx-auto px-8 py-8">
          {/* Date Navigation */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="px-3 py-2 text-sm font-medium bg-gray-50 dark:bg-gray-800 rounded-md min-w-[200px] text-center">
                      {getDateDisplayText()}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex rounded-lg border border-gray-200 dark:border-gray-700">
                    {(["day", "week", "month"] as const).map((mode) => (
                      <Button
                        key={mode}
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewMode(mode)}
                        className="rounded-none first:rounded-l-lg last:rounded-r-lg hover:bg-muted"
                        style={
                          viewMode === mode
                            ? ({ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" } as React.CSSProperties)
                            : undefined
                        }
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="!border-indigo-200 !text-indigo-600 hover:!bg-indigo-50 dark:!border-indigo-900 dark:!text-indigo-400 dark:hover:!bg-indigo-950/30"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Entry</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmitEntry} className="space-y-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newEntry.date}
                            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="activity">Activity</Label>
                          <Select
                            value={newEntry.activity}
                            onValueChange={(
                              value:
                                | "Project"
                                | "Request"
                                | "Incident"
                                | "Change"
                                | "Meeting"
                                | "Triage"
                                | "Collaboration"
                                | "Training"
                                | "Admin",
                            ) => setNewEntry({ ...newEntry, activity: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Project">Project</SelectItem>
                              <SelectItem value="Request">Request</SelectItem>
                              <SelectItem value="Incident">Incident</SelectItem>
                              <SelectItem value="Change">Change</SelectItem>
                              <SelectItem value="Meeting">Meeting</SelectItem>
                              <SelectItem value="Triage">Triage</SelectItem>
                              <SelectItem value="Collaboration">Collaboration</SelectItem>
                              <SelectItem value="Training">Training</SelectItem>
                              <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="ticket">Ticket (Optional)</Label>
                          <Input
                            id="ticket"
                            value={newEntry.ticket}
                            onChange={(e) => setNewEntry({ ...newEntry, ticket: e.target.value })}
                            placeholder="e.g., BOLT-123, INC-001"
                          />
                        </div>

                        <div>
                          <Label htmlFor="details">Details</Label>
                          <Textarea
                            id="details"
                            value={newEntry.details}
                            onChange={(e) => setNewEntry({ ...newEntry, details: e.target.value })}
                            placeholder="Describe what you worked on..."
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="time_worked">Duration (minutes)</Label>
                          <Input
                            id="time_worked"
                            type="number"
                            min="1"
                            max="1440"
                            value={newEntry.time_worked}
                            onChange={(e) =>
                              setNewEntry({ ...newEntry, time_worked: Number.parseInt(e.target.value) || 0 })
                            }
                            placeholder="e.g., 30, 60, 90"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Duration: {formatDuration(newEntry.time_worked || 0)}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Textarea
                            id="notes"
                            value={newEntry.notes}
                            onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                            placeholder="Additional notes..."
                          />
                        </div>

                        <Button type="submit" className="w-full">
                          Save Entry
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => hasActiveFilters ? setIsExportDialogOpen(true) : exportEntriesToCsv(false)}
                    className="!border-indigo-200 !text-indigo-600 hover:!bg-indigo-50 dark:!border-indigo-900 dark:!text-indigo-400 dark:hover:!bg-indigo-950/30"
                  >
                    <Download className="h-4 w-4 mr-2" /> Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    onClick={() => exportEntriesToCsv(false)}
                    className="justify-start h-14 text-base font-medium border-2 border-indigo-300 text-indigo-600 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all dark:border-indigo-700 dark:text-indigo-400 dark:hover:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-indigo-950"
                    variant="outline"
                  >
                    <Download className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-950" />
                    Export filtered results ({filteredEntries.length} entries)
                  </Button>
                  <Button
                    onClick={() => exportEntriesToCsv(true)}
                    className="justify-start h-14 text-base font-medium border-2 border-indigo-300 text-indigo-600 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white transition-all dark:border-indigo-700 dark:text-indigo-400 dark:hover:border-indigo-400 dark:hover:bg-indigo-400 dark:hover:text-indigo-950"
                    variant="outline"
                  >
                    <Download className="h-5 w-5 mr-3 text-indigo-600 dark:text-indigo-400 group-hover:text-white dark:group-hover:text-indigo-950" />
                    Export all entries ({entries.length} entries)
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Entry Count</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEntries}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                    <Ticket className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ticket Count</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.ticketCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Duration</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatDuration(stats.totalDuration)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search entries and tickets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterActivity} onValueChange={setFilterActivity}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Request">Request</SelectItem>
                    <SelectItem value="Incident">Incident</SelectItem>
                    <SelectItem value="Change">Change</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Triage">Triage</SelectItem>
                    <SelectItem value="Collaboration">Collaboration</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Entries Table */}
          <Card>
            <CardHeader>
              <CardTitle>Productivity Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading entries...</div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="mb-2">To set up the database table, run this SQL script:</p>
                    <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                      scripts/012_update_productivity_schema_activity.sql
                    </code>
                  </div>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No entries found for the selected criteria.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th
                          className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort("date")}
                        >
                          Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort("activity")}
                        >
                          Activity {sortField === "activity" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th
                          className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort("ticket")}
                        >
                          Ticket {sortField === "ticket" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium">Details</th>
                        <th
                          className="text-left py-3 px-4 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                          onClick={() => handleSort("time_worked")}
                        >
                          Duration {sortField === "time_worked" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="text-left py-3 px-4 font-medium">Notes</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEntries.map((entry) => (
                        <tr
                          key={entry.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <td className="py-3 px-4">{new Date(entry.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={activityColors[entry.activity]}>{entry.activity}</Badge>
                          </td>
                          <td className="py-3 px-4">{entry.ticket || "-"}</td>
                          <td className="py-3 px-4 max-w-xs truncate" title={entry.details}>
                            {entry.details}
                          </td>
                          <td className="py-3 px-4">{formatDuration(entry.time_worked)}</td>
                          <td className="py-3 px-4 max-w-xs truncate" title={entry.notes || ""}>
                            {entry.notes || "-"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEntry(entry)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEntry(entry.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditEntryOpen} onOpenChange={setIsEditEntryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <form onSubmit={handleUpdateEntry} className="space-y-4">
              <div>
                <Label htmlFor="edit-date">Date</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingEntry.date}
                  onChange={(e) => setEditingEntry({ ...editingEntry, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-activity">Activity</Label>
                <Select
                  value={editingEntry.activity}
                  onValueChange={(
                    value:
                      | "Project"
                      | "Request"
                      | "Incident"
                      | "Change"
                      | "Meeting"
                      | "Triage"
                      | "Collaboration"
                      | "Training"
                      | "Admin",
                  ) => setEditingEntry({ ...editingEntry, activity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Project">Project</SelectItem>
                    <SelectItem value="Request">Request</SelectItem>
                    <SelectItem value="Incident">Incident</SelectItem>
                    <SelectItem value="Change">Change</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Triage">Triage</SelectItem>
                    <SelectItem value="Collaboration">Collaboration</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-ticket">Ticket (Optional)</Label>
                <Input
                  id="edit-ticket"
                  value={editingEntry.ticket || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, ticket: e.target.value })}
                  placeholder="e.g., BOLT-123, INC-001"
                />
              </div>

              <div>
                <Label htmlFor="edit-details">Details</Label>
                <Textarea
                  id="edit-details"
                  value={editingEntry.details}
                  onChange={(e) => setEditingEntry({ ...editingEntry, details: e.target.value })}
                  placeholder="Describe what you worked on..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="edit-time_worked">Duration (minutes)</Label>
                <Input
                  id="edit-time_worked"
                  type="number"
                  min="1"
                  max="1440"
                  value={editingEntry.time_worked}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, time_worked: Number.parseInt(e.target.value) || 0 })
                  }
                  placeholder="e.g., 30, 60, 90"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Duration: {formatDuration(editingEntry.time_worked || 0)}</p>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  value={editingEntry.notes || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Update Entry
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditEntryOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

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
