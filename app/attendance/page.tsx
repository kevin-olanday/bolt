"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  AlertCircle,
  Calendar,
  Users,
  Edit,
  Trash2,
  ArrowLeft,
  CalendarDays,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  Plane,
  Heart,
  AlertTriangle,
  Star,
  Coffee,
  Umbrella,
  BarChart3,
  Zap,
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
import { Footer } from "@/components/footer"
import Link from "next/link"

interface AttendanceEntry {
  id: string
  user_id: string // This is now TEXT in the database, not UUID
  date: string
  attendance_type: 
    | "In Office"
    | "Work From Home (WFH)"
    | "Planned Leave"
    | "Sick Leave"
    | "Emergency Leave"
    | "Holiday"
    | "Half Day"
    | "Volunteer Leave"
    | "Off Day"
  notes?: string
  created_at: string
  updated_at: string
}

const attendanceColors = {
  "In Office": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
  "Work From Home (WFH)": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-300 dark:border-blue-700",
  "Planned Leave": "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700",
  "Sick Leave": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700",
  "Emergency Leave": "bg-red-600 text-white dark:bg-red-700 dark:text-white border-red-700 dark:border-red-800",
  "Holiday": "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 border-violet-300 dark:border-violet-700",
  "Half Day": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-700",
  "Volunteer Leave": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-pink-300 dark:border-pink-700",
  "Off Day": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700",
}

// New: Cell background colors for the entire calendar cell
const attendanceCellColors = {
  "In Office": "bg-emerald-50 dark:bg-emerald-950/30",
  "Work From Home (WFH)": "bg-blue-50 dark:bg-blue-950/30",
  "Planned Leave": "bg-amber-50 dark:bg-amber-950/30",
  "Sick Leave": "bg-red-50 dark:bg-red-950/30",
  "Emergency Leave": "bg-red-100 dark:bg-red-950/50",
  "Holiday": "bg-violet-50 dark:bg-violet-950/30",
  "Half Day": "bg-orange-50 dark:bg-orange-950/30",
  "Volunteer Leave": "bg-pink-50 dark:bg-pink-950/30",
  "Off Day": "bg-gray-50 dark:bg-gray-900/50",
}

const attendanceIcons = {
  "In Office": CheckCircle,
  "Work From Home (WFH)": Home,
  "Planned Leave": Plane,
  "Sick Leave": Heart,
  "Emergency Leave": AlertTriangle,
  "Holiday": Star,
  "Half Day": Clock,
  "Volunteer Leave": Coffee,
  "Off Day": Umbrella,
}

const attendanceHexColors = {
  "In Office": "#34D399",
  "Work From Home (WFH)": "#60A5FA",
  "Planned Leave": "#FBBF24",
  "Sick Leave": "#F87171",
  "Emergency Leave": "#DC2626",
  "Holiday": "#A78BFA",
  "Half Day": "#F97316",
  "Volunteer Leave": "#EC4899",
  "Off Day": "#E5E7EB",
}

// Loading component that will be shown while the page loads
function AttendanceLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 border-b-2 border-indigo-500/30 shadow-xl">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-indigo-400/30">
                <Calendar className="h-5 w-5 text-indigo-300" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold tracking-tight text-white leading-none">
                  Attendance
                </h1>
                <p className="text-sm text-indigo-200 leading-none tracking-wider uppercase mt-1">
                  Track daily attendance and leave management
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
                <Users className="h-8 w-8 text-white" />
              </div>
              
              {/* Floating Attendance Elements */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                <Clock className="h-3 w-3 text-white" />
              </div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
                <Zap className="h-3 w-3 text-white" />
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
              Loading Attendance System
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Synchronizing team data and preparing attendance dashboard...
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="mt-12 max-w-md mx-auto space-y-4">
            {/* Team Sync */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Team roster synchronization</span>
            </div>
            
            {/* Attendance Data */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="text-sm text-slate-700 dark:text-slate-300">Attendance records loading</span>
            </div>
            
            {/* Leave Management */}
            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
              <span className="text-sm text-slate-700 dark:text-slate-300">Leave management system ready</span>
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

export default function AttendancePage() {
  const [entries, setEntries] = useState<AttendanceEntry[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false)
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<AttendanceEntry | null>(null)
  const [tableExists, setTableExists] = useState<boolean | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    attendance_type: "In Office" as AttendanceEntry["attendance_type"],
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
  }, [currentMonth, tableExists])

  const checkTableExists = async () => {
    try {
      console.log("[v0] Checking if attendance table exists")
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("attendance").select("id").limit(1)

      if (error && error.message.includes("Could not find the table")) {
        console.log("[v0] Table does not exist")
        setTableExists(false)
        setError("Database table not found. Please run the setup script to create the attendance table.")
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
      setIsInitialLoading(false)
    }
  }

  const fetchEntries = async () => {
    if (!tableExists) return

    try {
      setIsRefreshing(true)
      setError(null)
      console.log("[v0] Fetching attendance entries for month")
      const supabase = getSupabaseClient()

      const startOfMonth = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), 1))
      const endOfMonth = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0))

      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .lte("date", endOfMonth.toISOString().split("T")[0])
        .order("date", { ascending: true })

      if (error) {
        console.error("[v0] Database error:", error)
        throw error
      }

      console.log("[v0] Successfully fetched", data?.length || 0, "entries")
      setEntries(data || [])
    } catch (error) {
      console.error("[v0] Error fetching entries:", error)
      setError("Failed to fetch attendance data. Please try again.")
    } finally {
      setIsRefreshing(false)
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

      // For development, we'll use a placeholder user_id since RLS is permissive
      // In production, this should be replaced with proper authentication
      const placeholderUserId = "dev-user-001"

      const { error } = await supabase.from("attendance").insert([
        {
          ...newEntry,
          user_id: placeholderUserId,
        },
      ])

      if (error) {
        console.error("Supabase error details:", error)
        throw error
      }

      setNewEntry({
        date: new Date().toISOString().split("T")[0],
        attendance_type: "In Office",
        notes: "",
      })

      setIsNewEntryOpen(false)
      fetchEntries()
    } catch (error) {
      console.error("Error creating entry:", error)
      if (error instanceof Error && error.message.includes("Could not find the table")) {
        setTableExists(false)
        setError("Database table not found. Please run the setup script to create the attendance table.")
      } else {
        console.error("Full error object:", error)
        alert(`Failed to save entry: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from("attendance").delete().eq("id", entryId)

      if (error) throw error

      fetchEntries()
    } catch (error) {
      console.error("Error deleting entry:", error)
      alert("Failed to delete entry. Please try again.")
    }
  }

  const handleEditEntry = (entry: AttendanceEntry) => {
    setEditingEntry(entry)
    setIsEditEntryOpen(true)
  }

  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEntry) return

    try {
      const supabase = getSupabaseClient()
      const { error } = await supabase
        .from("attendance")
        .update({
          date: editingEntry.date,
          attendance_type: editingEntry.attendance_type,
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

  const exportAttendanceToCsv = () => {
    const filename = `attendance-${currentMonth.toISOString().slice(0, 7)}.csv`
    
    const headerLabels = [
      "Date",
      "Attendance Type",
      "Notes",
      "Created At",
      "Updated At"
    ]
    
    const toCsvValue = (value: unknown) => {
      const raw = value ?? ""
      const str = String(raw)
      const needsQuoting = /[",\n]/.test(str)
      const escaped = str.replace(/"/g, '""')
      return needsQuoting ? `"${escaped}"` : escaped
    }
    
    const rows = entries.map((entry) => [
      entry.date,
      entry.attendance_type,
      entry.notes || "",
      entry.created_at,
      entry.updated_at
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
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(Date.UTC(year, month, 1))
    const lastDay = new Date(Date.UTC(year, month + 1, 0))
    const daysInMonth = lastDay.getUTCDate()
    const startingDayOfWeek = firstDay.getUTCDay()

    return { daysInMonth, startingDayOfWeek, lastDay }
  }

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return entries.find(entry => entry.date === dateStr)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isWeekend = (date: Date) => {
    // Create a date string in YYYY-MM-DD format to avoid timezone issues
    const dateString = date.toISOString().split('T')[0]
    const [year, month, day] = dateString.split('-').map(Number)
    // Create a new date object using UTC to avoid timezone issues
    const utcDate = new Date(Date.UTC(year, month - 1, day))
    const dayOfWeek = utcDate.getUTCDay()
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  const getDefaultAttendanceType = (date: Date) => {
    if (isWeekend(date)) return "Off Day"
    return "In Office"
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    const existingEntry = getAttendanceForDate(date)
    
    if (existingEntry) {
      setEditingEntry(existingEntry)
      setIsEditEntryOpen(true)
    } else {
      setNewEntry({
        date: date.toISOString().split("T")[0],
        attendance_type: getDefaultAttendanceType(date),
        notes: "",
      })
      setIsNewEntryOpen(true)
    }
  }

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, lastDay } = getDaysInMonth(currentMonth)
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-900/50" />)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Create date using UTC to avoid timezone issues
      const date = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day))
      const attendance = getAttendanceForDate(date)
      const isCurrentDay = isToday(date)
      const isCurrentWeekend = isWeekend(date)

             days.push(
         <div
           key={day}
           onClick={() => handleDateClick(date)}
           className={`h-24 p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 ${
             attendance ? attendanceCellColors[attendance.attendance_type] : 
             isCurrentWeekend ? attendanceCellColors["Off Day"] : "bg-white dark:bg-gray-900"
           } hover:bg-opacity-80 ${
             isCurrentDay ? "ring-2 ring-indigo-500 ring-offset-2" : ""
           }`}
         >
                     <div className="flex justify-between items-start mb-1">
             <span className={`text-sm font-medium ${
               isCurrentDay ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100"
             }`}>
               {day}
             </span>
                           {attendance ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: attendanceHexColors[attendance.attendance_type] }} />
                  <div className="p-1 rounded-full bg-white/80 dark:bg-black/20">
                    {(() => {
                      const Icon = attendanceIcons[attendance.attendance_type]
                      return <Icon className="h-3 w-3" style={{ color: attendanceHexColors[attendance.attendance_type] }} />
                    })()}
                  </div>
                </div>
              ) : isCurrentWeekend ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <div className="p-1 rounded-full bg-white/80 dark:bg-black/20">
                    <Umbrella className="h-3 w-3" style={{ color: "#94A3B8" }} />
                  </div>
                </div>
              ) : null}
           </div>
          
                     {attendance ? (
             <div className="space-y-1">
               <div className="text-xs px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 text-gray-800 dark:text-gray-200 font-medium">
                 {attendance.attendance_type}
               </div>
               {attendance.notes && (
                 <div className="text-xs text-gray-700 dark:text-gray-300 truncate font-medium" title={attendance.notes}>
                   {attendance.notes}
                 </div>
               )}
             </div>
           ) : (
             <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
               {isCurrentWeekend ? "Off Day" : "Click to set"}
             </div>
           )}
        </div>
      )
    }

    return days
  }

  const getStats = () => {
    const totalDays = new Date(Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)).getUTCDate()
    const inOfficeDays = entries.filter(entry => entry.attendance_type === "In Office").length
    const wfhDays = entries.filter(entry => entry.attendance_type === "Work From Home (WFH)").length
    const presentDays = inOfficeDays + wfhDays
    
    // Calculate non-working days (holidays and off days)
    const nonWorkingDays = entries.filter(entry => 
      entry.attendance_type === "Holiday" || 
      entry.attendance_type === "Off Day"
    ).length
    
    // Total Working Days = Total Days - Non-working Days
    const totalWorkingDays = totalDays - nonWorkingDays
    
    // Leave Days (all types of leave)
    const leaveDays = entries.filter(entry => 
      entry.attendance_type === "Planned Leave" || 
      entry.attendance_type === "Sick Leave" || 
      entry.attendance_type === "Emergency Leave" ||
      entry.attendance_type === "Volunteer Leave" ||
      entry.attendance_type === "Half Day"
    ).length
    
    // Attendance Rate based only on sick leaves and emergency leaves
    const negativeLeaves = entries.filter(entry => 
      entry.attendance_type === "Sick Leave" || 
      entry.attendance_type === "Emergency Leave"
    ).length
    
    // Calculate attendance rate: (Working Days - Negative Leaves) / Working Days * 100
    const attendanceRate = totalWorkingDays > 0 ? Math.round(((totalWorkingDays - negativeLeaves) / totalWorkingDays) * 100) : 0

    return { 
      totalWorkingDays, 
      inOfficeDays, 
      wfhDays, 
      presentDays, 
      leaveDays, 
      attendanceRate,
      nonWorkingDays 
    }
  }

  const stats = getStats()

  // Show loading component only for initial page load
  if (isInitialLoading) {
    return <AttendanceLoading />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <TopNav />
      
      <div className="max-w-screen-xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Tracker</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Track your daily attendance and leave management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsNewEntryOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Entry
            </Button>
            
            <Button
              onClick={() => exportAttendanceToCsv()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Divider - Full Width */}
      <div className="border-b border-gray-200 dark:border-gray-700"></div>

      <div className="max-w-screen-xl mx-auto px-8 py-6">
        {/* Month Navigation */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigateMonth("prev")}
                  className="p-3 hover:scale-105 transition-transform shadow-sm hover:shadow-md cursor-pointer"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h2>
                  {isRefreshing && (
                    <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                  )}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => navigateMonth("next")}
                  className="p-3 hover:scale-105 transition-transform shadow-sm hover:shadow-md cursor-pointer"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <Select
                  value={currentMonth.getFullYear().toString()}
                  onValueChange={(value) => {
                    const newDate = new Date(currentMonth)
                    newDate.setFullYear(parseInt(value))
                    setCurrentMonth(newDate)
                  }}
                >
                  <SelectTrigger className="w-28 h-11 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - 5 + i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                
                <Select
                  value={currentMonth.getMonth().toString()}
                  onValueChange={(value) => {
                    const newDate = new Date(currentMonth)
                    newDate.setMonth(parseInt(value))
                    setCurrentMonth(newDate)
                  }}
                >
                  <SelectTrigger className="w-36 h-11 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"
                    ].map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-6 py-2.5 h-11 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  Today
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error ? (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

                  {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3">
                    <CalendarDays className="h-6 w-6 text-emerald-700 dark:text-emerald-200" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Working Days</p>
                    <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{stats.totalWorkingDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3">
                    <CheckCircle className="h-6 w-6 text-green-700 dark:text-green-200" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">In Office</p>
                    <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.inOfficeDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3">
                    <Home className="h-6 w-6 text-blue-700 dark:text-blue-200" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">WFH</p>
                    <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.wfhDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3">
                    <Plane className="h-6 w-6 text-amber-700 dark:text-amber-200" />
                  </div>
                  <div>
                    <p className="text-sm text-amber-700 dark:text-amber-300 font-medium">Leaves</p>
                    <p className="text-3xl font-bold text-amber-900 dark:text-amber-100">{stats.leaveDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/30 border-indigo-200 dark:border-indigo-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3">
                    <BarChart3 className="h-6 w-6 text-indigo-700 dark:text-indigo-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Attendance Rate</p>
                      <div className="group relative">
                        <div className="w-4 h-4 rounded-full bg-indigo-300 dark:bg-indigo-600 flex items-center justify-center cursor-help">
                          <span className="text-xs text-indigo-700 dark:text-indigo-300 font-bold">?</span>
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="text-center">
                            <div className="font-medium mb-1">How it's calculated:</div>
                            <div>(Working Days - Sick Leave - Emergency Leave) / Working Days × 100</div>
                            <div className="text-gray-300 text-xs mt-1">Only negative leaves count against attendance</div>
                          </div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">{stats.attendanceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>



        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-gray-100 dark:bg-gray-800 p-3 text-center font-medium text-gray-700 dark:text-gray-300">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
                 <Card className="mt-6">
           <CardHeader>
             <CardTitle>Attendance Status Legend</CardTitle>
           </CardHeader>
           <CardContent>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               {Object.entries(attendanceColors).map(([type, colorClass]) => {
                  const Icon = attendanceIcons[type as keyof typeof attendanceIcons]
                  return (
                    <div key={type} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 ${attendanceCellColors[type as keyof typeof attendanceCellColors]}`} />
                      <Icon className="h-4 w-4" style={{ color: attendanceHexColors[type as keyof typeof attendanceHexColors] }} />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{type}</span>
                    </div>
                  )
                })}
             </div>
           </CardContent>
         </Card>
      </div>

      {/* New Entry Dialog */}
      <Dialog open={isNewEntryOpen} onOpenChange={setIsNewEntryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Attendance Entry</DialogTitle>
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
              <Label htmlFor="attendance_type">Attendance Type</Label>
              <Select
                value={newEntry.attendance_type}
                onValueChange={(value: AttendanceEntry["attendance_type"]) => 
                  setNewEntry({ ...newEntry, attendance_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(attendanceColors).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newEntry.notes}
                onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                placeholder="Add any notes about your attendance..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1 cursor-pointer">
                Create Entry
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsNewEntryOpen(false)} className="cursor-pointer">
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditEntryOpen} onOpenChange={setIsEditEntryOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Attendance Entry</DialogTitle>
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
                <Label htmlFor="edit-attendance_type">Attendance Type</Label>
                <Select
                  value={editingEntry.attendance_type}
                  onValueChange={(value: AttendanceEntry["attendance_type"]) => 
                    setEditingEntry({ ...editingEntry, attendance_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(attendanceColors).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea
                  id="edit-notes"
                  value={editingEntry.notes || ""}
                  onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  placeholder="Add any notes about your attendance..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1 cursor-pointer">
                  Update Entry
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditEntryOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
