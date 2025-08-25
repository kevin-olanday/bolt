"use client"

import { useState, useEffect } from "react"
import { FileText, ArrowLeft, Copy, Download, Eye, Key, Flame, Clock, EyeOff } from "lucide-react"
import hljs from "highlight.js"
import "highlight.js/styles/github-dark.css"
import CryptoJS from "crypto-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { TopNav } from "@/components/top-nav"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { useParams } from "next/navigation"

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

// Decryption function for client-side security
const decryptContent = (encryptedContent: string, key: string): string => {
  try {
    // Decrypt content using AES-256
    const bytes = CryptoJS.AES.decrypt(encryptedContent, key)
    return bytes.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error("Decryption failed:", error)
    return "Decryption failed - content may be corrupted or key is invalid"
  }
}

export default function ViewPastePage() {
  const params = useParams()
  const pasteId = params.id as string
  
  const [paste, setPaste] = useState<PasteEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)
  const [isBurned, setIsBurned] = useState(false)
  const [viewCounted, setViewCounted] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (pasteId) {
      fetchPaste()
    }
  }, [pasteId])

  const fetchPaste = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("safe_pastes")
        .select("*")
        .eq("id", pasteId)
        .single()

      if (error) {
        console.error("Error fetching paste:", error)
        setError("Paste not found or access denied")
        return
      }

      if (!data) {
        setError("Paste not found")
        return
      }

      // Check if paste is expired
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        setIsExpired(true)
        setError("This paste has expired")
        return
      }

      // Check if paste requires password
      if (data.password && !password) {
        setShowPasswordForm(true)
        setLoading(false)
        return
      }

      // Verify password if required
      if (data.password && password !== data.password) {
        setError("Incorrect password")
        setShowPasswordForm(true)
        setLoading(false)
        return
      }

      // Extract encryption key from URL hash
      const encryptionKey = window.location.hash.substring(1)
      if (!encryptionKey) {
        setError("Missing encryption key - this paste cannot be decrypted")
        return
      }

      // Decrypt the content
      const decryptedContent = decryptContent(data.content, encryptionKey)
      if (decryptedContent === "Decryption failed - content may be corrupted or key is invalid") {
        setError("Failed to decrypt paste - the encryption key may be invalid")
        return
      }

      // Create paste object with decrypted content
      const decryptedPaste = {
        ...data,
        content: decryptedContent
      }

      setPaste(decryptedPaste)
      setShowPasswordForm(false)

      // Increment view count only once per page load
      if (!viewCounted) {
        await supabase
          .from("safe_pastes")
          .update({ views: (data.views || 0) + 1 })
          .eq("id", pasteId)
        
        // Update local state to reflect the new view count
        setPaste({ ...decryptedPaste, views: (data.views || 0) + 1 })
        setViewCounted(true)
      }
    } catch (error) {
      console.error("Error fetching paste:", error)
      setError("Failed to load paste")
    } finally {
      setLoading(false)
    }
  }

  const handleBurnAfterReading = async () => {
    if (paste && paste.burn_after_reading) {
      try {
        // Delete the paste after user has viewed it
        await supabase
          .from("safe_pastes")
          .delete()
          .eq("id", pasteId)
        
        setIsBurned(true)
      } catch (error) {
        console.error("Error burning paste:", error)
      }
    }
  }

  // Auto-burn when user leaves the page
  useEffect(() => {
    if (paste && paste.burn_after_reading) {
      const handleBeforeUnload = () => {
        // Burn the paste when user leaves the page
        handleBurnAfterReading()
      }

      const handleVisibilityChange = () => {
        // Only burn when user actually leaves the page, not when switching tabs
        // This is a more conservative approach - only burn on actual page exit
        // Tab switching and minimizing won't trigger burning
      }

      // Add event listeners
      window.addEventListener('beforeunload', handleBeforeUnload)
      document.addEventListener('visibilitychange', handleVisibilityChange)

      // Cleanup function - only remove event listeners, don't burn
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [paste])

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchPaste()
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

  const renderContent = (content: string, format: string, language: string) => {
    // Common stats for all formats - avoid duplication
    const languageLabel = getLanguageLabel(language)
    const formatLabel = getFormatLabel(format)
    
    // Only show language if it's different from format
    const shouldShowLanguage = languageLabel !== formatLabel
    
    const stats = (
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <span>{content.length} characters</span>
          <span>•</span>
          <span>{content.split('\n').length} lines</span>
          {shouldShowLanguage && (
            <>
              <span>•</span>
              <span>{languageLabel}</span>
            </>
          )}
          <span>•</span>
          <span>{formatLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(content, "Content")}
            className="h-6 px-2 text-xs cursor-pointer"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(`${window.location.origin}/safe-paste/${paste?.id}`, "Link")}
            className="h-6 px-2 text-xs cursor-pointer"
          >
            <Copy className="h-3 w-3 mr-1" />
            Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const blob = new Blob([content], { type: "text/plain" })
              const url = URL.createObjectURL(blob)
              const a = document.createElement("a")
              a.href = url
              a.download = `${paste?.title || "paste"}.txt`
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="h-6 px-2 text-xs cursor-pointer"
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </div>
    )

    if (format === "markdown") {
      // Enhanced markdown preview with better formatting
      return (
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          {stats}
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
        </div>
      )
    } else if (format === "source_code") {
      // For source code format, use the paste's language or auto-detect
      const detectedLanguage = language !== "text" ? language : detectLanguage(content)
      const formattedContent = formatCode(content, detectedLanguage)
      
      return (
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-4 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-700">
          {stats}
          <pre className="text-sm leading-relaxed m-0">
            <code 
              dangerouslySetInnerHTML={{ __html: formattedContent }}
              className="hljs"
            />
          </pre>
        </div>
      )
    } else {
      // Plain text with alternating line colors like PrivateBin
      const lines = content.split('\n')
      return (
        <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
          {stats}
          {lines.map((line, index) => (
            <div 
              key={index}
              className={`px-4 py-1 font-mono text-sm ${
                index % 2 === 0 
                  ? 'bg-slate-50 dark:bg-slate-800' 
                  : 'bg-white dark:bg-slate-900'
              }`}
            >
              {line || '\u00A0'}
            </div>
          ))}
        </div>
      )
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
                <Link href="/safe-paste" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h1 className="text-3xl font-bold text-foreground">Loading Paste...</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading paste...</div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
        <TopNav />
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3">
                <Link href="/safe-paste" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h1 className="text-3xl font-bold text-foreground">Paste Not Found</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto px-8 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <div className="text-6xl font-bold text-gray-300 dark:text-slate-600 mb-4">404</div>
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-slate-400 mb-2">
                  {isExpired ? "Paste Expired" : "Paste Not Found"}
                </h2>
                <p className="text-gray-500 dark:text-slate-500 mb-6">
                  {isExpired 
                    ? "This paste has expired and is no longer available."
                    : "The paste you're looking for doesn't exist or has been removed."
                  }
                </p>
                <Link href="/safe-paste">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Safe Paste
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (showPasswordForm) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
        <TopNav />
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3">
                <Link href="/safe-paste" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex items-center gap-2">
                  <Key className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h1 className="text-3xl font-bold text-foreground">Password Required</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto px-8 py-8">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Key className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-600 dark:text-slate-400 mb-2">
                    This paste is password protected
                  </h2>
                  <p className="text-gray-500 dark:text-slate-500">
                    Enter the password to view the content
                  </p>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                    <Key className="w-4 h-4 mr-2" />
                    Unlock Paste
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (isBurned) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
        <TopNav />
        <div className="flex-1">
          <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
            <div className="max-w-screen-xl mx-auto px-8 py-6">
              <div className="flex items-center gap-3">
                <Link href="/safe-paste" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Link>
                <div className="flex items-center gap-2">
                  <Flame className="h-6 w-6 text-red-600 dark:text-red-400" />
                  <h1 className="text-3xl font-bold text-foreground">Paste Burned</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="max-w-screen-xl mx-auto px-8 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Flame className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-slate-400 mb-2">
                  This paste has been burned
                </h2>
                <p className="text-gray-500 dark:text-slate-500 mb-6">
                  The paste was configured to be deleted after viewing and is no longer available.
                </p>
                <Link href="/safe-paste">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Safe Paste
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!paste) {
    return null
  }

  return (
    <div className="min-h-screen bg-background dark:bg-slate-900 flex flex-col">
      <TopNav />

      {/* Header */}
      <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Link href="/safe-paste" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  <h1 className="text-3xl font-bold text-foreground">
                    {paste.title || "Untitled Paste"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {getLanguageLabel(paste.language)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getFormatLabel(paste.format)}
                  </Badge>
                  {paste.password && (
                    <Badge variant="outline" className="text-xs">
                      <Key className="h-3 w-3 mr-1" />
                      Password Protected
                    </Badge>
                  )}
                  {paste.burn_after_reading && (
                    <Badge variant="outline" className="text-xs">
                      <Flame className="h-3 w-3 mr-1" />
                      Burn After Reading
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="max-w-screen-xl mx-auto px-8 py-8">
          {/* Burn After Reading Warning */}
          {paste.burn_after_reading && (
            <Card className="mb-6 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm font-medium">
                    ⚠️ This paste will be automatically deleted when you leave this page
                  </span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 ml-6">
                  Make sure to copy or download any important content before navigating away
                </p>
              </CardContent>
            </Card>
          )}

          {/* Paste Info */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Created: {new Date(paste.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {paste.views} views
                </div>
                {paste.expires_at && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Expires: {new Date(paste.expires_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>



          {/* Content Display */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="p-6">
                {renderContent(paste.content, paste.format, paste.language)}
              </div>
            </CardContent>
          </Card>


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
