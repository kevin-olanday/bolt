"use client"

import { useState, useEffect } from "react"
import { FileText, ArrowLeft, Plus, Copy, Trash2, Eye, Download, Search, Filter, Clock, User, Lock, Globe, EyeOff, Key, Flame } from "lucide-react"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import CryptoJS from "crypto-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import Link from "next/link"

interface PasteEntry {
  id: string
  user_id: string
  title: string
  content: string
  format: "plain_text" | "source_code" | "markdown"
  language: string
  visibility: "public" | "private" | "unlisted"
  password: string | null
  burn_after_reading: boolean
  expires_at: string | null
  created_at: string
  updated_at: string
  views: number
  encryption_key?: string // Client-side encryption key (never stored in DB)
}

const languageOptions = [
  { value: "text", label: "Plain Text" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "xml", label: "XML" },
  { value: "yaml", label: "YAML" },
  { value: "bash", label: "Bash" },
  { value: "powershell", label: "PowerShell" },
  { value: "dockerfile", label: "Dockerfile" },
  { value: "log", label: "Log File" },
  { value: "config", label: "Configuration" }
]

const formatOptions = [
  { value: "plain_text", label: "Plain Text", description: "Simple text without formatting" },
  { value: "source_code", label: "Source Code", description: "Code with syntax highlighting" },
  { value: "markdown", label: "Markdown", description: "Rich text with markdown support" }
]

const expirationOptions = [
  { value: "5m", label: "5 minutes" },
  { value: "10m", label: "10 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "1d", label: "1 day" },
  { value: "1w", label: "1 week" },
  { value: "1M", label: "1 month" },
  { value: "1y", label: "1 year" },
  { value: "never", label: "Never" }
]

const visibilityOptions = [
  { value: "public", label: "Public", icon: Globe, description: "Anyone can view" },
  { value: "unlisted", label: "Unlisted", icon: Eye, description: "Only those with the link can view" },
  { value: "private", label: "Private", icon: Lock, description: "Only you can view" }
]

// Encryption functions for client-side security
const generateEncryptionKey = (): string => {
  // Generate a random 32-byte key (256 bits)
  return CryptoJS.lib.WordArray.random(32).toString()
}

const encryptContent = (content: string, key: string): string => {
  // Encrypt content using AES-256
  return CryptoJS.AES.encrypt(content, key).toString()
}

const decryptContent = (encryptedContent: string, key: string): string => {
  try {
    // Decrypt content using AES-256
    const bytes = CryptoJS.AES.decrypt(encryptedContent, key)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption failed:", error)
    return "Decryption failed - content may be corrupted"
  }
}

export default function SafePastePage() {
  const [pastes, setPastes] = useState<PasteEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"editor" | "preview">("editor")
  const [createdPasteUrl, setCreatedPasteUrl] = useState<string | null>(null)

  // Form state
  const [newPaste, setNewPaste] = useState({
    title: "",
    content: "",
    format: "plain_text" as const,
    language: "text",
    visibility: "unlisted" as const,
    password: "",
    burn_after_reading: false,
    expiration: "1w"
  })

  const supabase = createClient()

  useEffect(() => {
    fetchPastes()
  }, [])

  const fetchPastes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("safe_pastes")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching pastes:", error)
        return
      }

      setPastes(data || [])
    } catch (error) {
      console.error("Error fetching pastes:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePaste = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Generate encryption key for this paste
      const encryptionKey = generateEncryptionKey()
      
      // Encrypt the content before sending to database
      const encryptedContent = encryptContent(newPaste.content, encryptionKey)
      
      // Calculate expiration date based on selection
      let expires_at = null
      if (newPaste.expiration !== "never") {
        const now = new Date()
        switch (newPaste.expiration) {
          case "5m":
            expires_at = new Date(now.getTime() + 5 * 60 * 1000).toISOString()
            break
          case "10m":
            expires_at = new Date(now.getTime() + 10 * 60 * 1000).toISOString()
            break
          case "1h":
            expires_at = new Date(now.getTime() + 60 * 60 * 1000).toISOString()
            break
          case "1d":
            expires_at = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
            break
          case "1w":
            expires_at = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
            break
          case "1M":
            expires_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
            break
          case "1y":
            expires_at = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()
            break
        }
      }

      const { data, error } = await supabase
        .from("safe_pastes")
        .insert([
          {
            user_id: "dev-user-001", // Placeholder for development
            title: newPaste.title || "Untitled Paste",
            content: encryptedContent, // Store encrypted content
            format: newPaste.format,
            language: newPaste.language,
            visibility: newPaste.visibility,
            password: newPaste.password || null,
            burn_after_reading: newPaste.burn_after_reading,
            expires_at: expires_at,
            views: 0
          }
        ])
        .select()

      if (error) {
        console.error("Error creating paste:", error)
        return
      }

      // Show success with URL that includes encryption key
      if (data && data[0]) {
        // Include encryption key in URL for decryption (like PrivateBin)
        const pasteUrl = `${window.location.origin}/safe-paste/${data[0].id}#${encryptionKey}`
        setCreatedPasteUrl(pasteUrl)
      }

      // Reset form but keep URL visible
      setNewPaste({
        title: "",
        content: "",
        format: "plain_text",
        language: "text",
        visibility: "unlisted",
        password: "",
        burn_after_reading: false,
        expiration: "1w"
      })
      
      // Refresh the list
      fetchPastes()
    } catch (error) {
      console.error("Error creating paste:", error)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(`${type} copied!`)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getLanguageLabel = (value: string) => {
    return languageOptions.find(lang => lang.value === value)?.label || value
  }

  const getFormatLabel = (value: string) => {
    return formatOptions.find(fmt => fmt.value === value)?.label || value
  }

  const getVisibilityIcon = (visibility: string) => {
    const option = visibilityOptions.find(v => v.value === visibility)
    const IconComponent = option?.icon || Globe
    return <IconComponent className="h-4 w-4" />
  }

  const getVisibilityLabel = (visibility: string) => {
    return visibilityOptions.find(v => v.value === visibility)?.label || visibility
  }

  const getExpirationLabel = (value: string) => {
    return expirationOptions.find(exp => exp.value === value)?.label || value
  }

  const renderPreview = (content: string, format: string) => {
    if (format === "markdown") {
      // Enhanced markdown preview with better formatting
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ 
            __html: content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/`(.*?)`/g, '<code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">$1</code>')
              .replace(/^### (.*$)/gim, '<h3 className="text-lg font-semibold mt-4 mb-2">$1</h3>')
              .replace(/^## (.*$)/gim, '<h2 className="text-xl font-semibold mt-6 mb-3">$1</h2>')
              .replace(/^# (.*$)/gim, '<h1 className="text-2xl font-bold mt-8 mb-4">$1</h1>')
              .replace(/\n\n/g, '</p><p>')
              .replace(/^\n/, '<p>')
              .replace(/\n$/, '</p>')
              .replace(/^(.+)$/gm, '<p>$1</p>')
          }} />
        </div>
      )
    } else if (format === "source_code") {
      // For source code format, use the user's selected language or auto-detect
      const language = newPaste.language !== "text" ? newPaste.language : detectLanguage(content)
      const formattedContent = formatCode(content, language)
      
      return (
        <div className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-700">
            <span className="text-xs text-slate-400 uppercase tracking-wide">{getLanguageLabel(language)}</span>
          </div>
          <pre className="text-sm leading-relaxed">
            <code 
              dangerouslySetInnerHTML={{ __html: formattedContent }}
              className="hljs"
            />
          </pre>
        </div>
      )
    } else {
      // Plain text with smart formatting
      return (
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border">
          {content}
        </div>
      )
    }
  }

  // Intelligent language detection using highlight.js
  const detectLanguage = (content: string): string => {
    const trimmed = content.trim()
    
    // Special case: JSON detection (highest priority)
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed)
        return 'json'
      } catch {
        // Not valid JSON, continue to highlight.js detection
      }
    }
    
    // Use highlight.js auto-detection
    try {
      const result = hljs.highlightAuto(trimmed)
      if (result.language) {
        // Map highlight.js language names to our language options
        const languageMap: { [key: string]: string } = {
          'javascript': 'javascript',
          'typescript': 'typescript',
          'python': 'python',
          'java': 'java',
          'cpp': 'cpp',
          'csharp': 'csharp',
          'php': 'php',
          'ruby': 'ruby',
          'go': 'go',
          'rust': 'rust',
          'sql': 'sql',
          'html': 'html',
          'css': 'css',
          'xml': 'xml',
          'yaml': 'yaml',
          'bash': 'bash',
          'shell': 'bash',
          'powershell': 'powershell',
          'dockerfile': 'dockerfile',
          'json': 'json',
          'markdown': 'text',
          'text': 'text'
        }
        
        return languageMap[result.language] || 'text'
      }
    } catch (error) {
      console.warn('Language detection failed:', error)
    }
    
    return 'text'
  }

  // Format code with proper syntax highlighting using highlight.js
  const formatCode = (content: string, language: string): string => {
    try {
      if (language === 'json') {
        // Pretty print JSON first
        try {
          const parsed = JSON.parse(content)
          content = JSON.stringify(parsed, null, 2)
        } catch {
          // If not valid JSON, keep original content
        }
      }
      
      // Use highlight.js for syntax highlighting
      const result = hljs.highlight(content, { 
        language: language === 'text' ? 'plaintext' : language 
      })
      
      return result.value
    } catch (error) {
      console.warn('Syntax highlighting failed:', error)
      // Fallback: just escape HTML
      return content
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
        <TopNav />
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3">
                <Link href="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h1 className="text-3xl font-bold text-foreground">Safe Paste</h1>
                </div>
              </div>
              <p className="mt-2 text-muted-foreground">Securely share text snippets and code</p>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading Safe Paste...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
      <TopNav />

      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <h1 className="text-3xl font-bold text-foreground">Safe Paste</h1>
            </div>
          </div>
          <p className="mt-2 text-muted-foreground">Securely share text snippets and code</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-screen-xl mx-auto px-8 py-8">
          
          {/* Success Message */}
          {createdPasteUrl && (
            <div className="mb-8 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-green-800 dark:text-green-200 font-medium text-lg">Your paste is ready!</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreatedPasteUrl(null)}
                  className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400 cursor-pointer"
                >
                  Create Another
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    value={createdPasteUrl}
                    readOnly
                    className="bg-white border-green-300 text-green-800 font-mono text-sm cursor-pointer"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(createdPasteUrl, "URL")}
                    className="border-green-300 text-green-600 hover:text-green-700 cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Share this link with others to view your paste
                </p>
              </div>
            </div>
          )}

          {/* Configuration Options */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-slate-400">Expires:</span>
                <Select value={newPaste.expiration} onValueChange={(value) => setNewPaste({ ...newPaste, expiration: value })}>
                  <SelectTrigger className="w-32 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {expirationOptions.map((exp) => (
                      <SelectItem key={exp.value} value={exp.value}>
                        {exp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="burn_after_reading"
                  checked={newPaste.burn_after_reading}
                  onCheckedChange={(checked) => setNewPaste({ ...newPaste, burn_after_reading: checked as boolean })}
                />
                <label htmlFor="burn_after_reading" className="text-sm text-gray-600 dark:text-slate-400 cursor-pointer">
                  Burn after reading
                </label>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-slate-400">Password:</span>
                <Input
                  type="password"
                  placeholder="Optional"
                  value={newPaste.password}
                  onChange={(e) => setNewPaste({ ...newPaste, password: e.target.value })}
                  className="w-32"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-slate-400">Format:</span>
                <Select value={newPaste.format} onValueChange={(value: any) => setNewPaste({ ...newPaste, format: value })}>
                  <SelectTrigger className="w-32 cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((fmt) => (
                      <SelectItem key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Editor/Preview Tabs */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-4">
            <Button
              type="button"
              variant={viewMode === "editor" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("editor")}
              className="cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Editor
            </Button>
            <Button
              type="button"
              variant={viewMode === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("preview")}
              className="cursor-pointer"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>

          {/* Content Area */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mb-6">
            {viewMode === "editor" ? (
              <Textarea
                placeholder="Paste your text, code, or content here..."
                value={newPaste.content}
                onChange={(e) => setNewPaste({ ...newPaste, content: e.target.value })}
                required
                className="font-mono text-sm min-h-[500px] resize-none border-0 rounded-lg"
              />
            ) : (
              <div className="p-6 min-h-[500px]">
                {newPaste.content ? (
                  renderPreview(newPaste.content, newPaste.format)
                ) : (
                  <p className="text-gray-500 dark:text-slate-400 text-center py-20">
                    Start typing in the editor to see a preview here
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleCreatePaste}
              disabled={!newPaste.content.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Paste
            </Button>
          </div>

        </div>
      </div>

      {/* Copy Success Alert */}
      {copySuccess && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200">
            <AlertDescription>{copySuccess}</AlertDescription>
          </Alert>
        </div>
      )}

      <Footer />
    </div>
  )
}

