'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  HiUser,
  HiMail,
  HiCalendar,
  HiChatAlt2,
  HiLightningBolt,
  HiClock,
  HiTrendingUp,
  HiCheckCircle,
  HiScale,
  HiLogout,
  HiPencil,
  HiArrowLeft,
  HiBookOpen,
  HiChartBar,
} from 'react-icons/hi'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/lib/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface UserStats {
  totalChats: number
  totalMessages: number
  questionsAsked: number
  avgResponseTime: string
  accountAge: number
  mostActiveDay: string
  lastActive: Date
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, logout, deleteAccount } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalChats: 0,
    totalMessages: 0,
    questionsAsked: 0,
    avgResponseTime: '< 2s',
    accountAge: 0,
    mostActiveDay: 'Monday',
    lastActive: new Date(),
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Redirect if not logged in
    if (!loading && !user) {
      router.push('/auth/signin')
      return
    }

    // Calculate account age
    if (user?.metadata.creationTime) {
      const created = new Date(user.metadata.creationTime)
      const now = new Date()
      const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      setStats(prev => ({ ...prev, accountAge: days }))
    }

    // Load saved chats from localStorage
    const savedChats = localStorage.getItem(`avokati_chats_${user?.uid}`)
    if (savedChats) {
      try {
        const chats = JSON.parse(savedChats)
        const totalMessages = chats.reduce((acc: number, chat: any) => 
          acc + (chat.messages?.length || 0), 0
        )
        const questionsAsked = Math.floor(totalMessages / 2) // Roughly half are questions
        
        setStats(prev => ({
          ...prev,
          totalChats: chats.length,
          totalMessages,
          questionsAsked,
        }))
      } catch (error) {
        console.error('Error loading chat stats:', error)
      }
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    }
  }

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsDeleting(true)
    const loadingToast = toast.loading('Deleting account...')

    try {
      await deleteAccount()
      toast.success('Account deleted successfully', { id: loadingToast })
      router.push('/')
    } catch (error: any) {
      console.error('Delete account error:', error)
      
      // Handle re-authentication required error
      if (error.code === 'auth/requires-recent-login') {
        toast.error(
          'For security, please log out and log back in before deleting your account',
          { id: loadingToast, duration: 5000 }
        )
      } else {
        toast.error(`Failed to delete account: ${error.message}`, { id: loadingToast })
      }
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-pulse">
            <HiScale className="w-10 h-10 text-white" />
          </div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get user initials
  const getInitials = (name: string | null, email: string | null) => {
    if (name) {
      const names = name.trim().split(' ')
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
    if (email) {
      return email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const userInitials = getInitials(user.displayName, user.email)

  const statCards = [
    {
      title: 'Total Chats',
      value: stats.totalChats,
      icon: HiChatAlt2,
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
    },
    {
      title: 'Questions Asked',
      value: stats.questionsAsked,
      icon: HiBookOpen,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages,
      icon: HiChartBar,
      color: 'from-emerald-500 to-green-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Avg Response',
      value: stats.avgResponseTime,
      icon: HiLightningBolt,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="glass-sm border-b border-slate-800/50 sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/chat">
                <Button variant="ghost" size="sm" icon={<HiArrowLeft />}>
                  Back to Chat
                </Button>
              </Link>
              <div className="h-6 w-px bg-slate-700" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <HiScale className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-display font-bold gradient-text">
                  Profile
                </h1>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={<HiLogout />}
              onClick={handleLogout}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <Card variant="glass">
              <CardContent className="p-4 md:p-6">
                {/* Avatar */}
                <div className="flex flex-col items-center text-center mb-4 md:mb-6">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-3 md:mb-4 shadow-lg shadow-cyan-500/30">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {userInitials}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-400 mb-2 md:mb-3 truncate max-w-full px-2">{user.email}</p>
                  
                  {/* Verification Badge */}
                  {user.emailVerified && (
                    <Badge variant="success" className="mb-3 md:mb-4">
                      <HiCheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Account Details */}
                <div className="space-y-3 md:space-y-4 border-t border-slate-700/50 pt-4 md:pt-6">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <HiMail className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-500">Email</p>
                      <p className="text-white truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <HiCalendar className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-500">Member Since</p>
                      <p className="text-white">
                        {user.metadata.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <HiClock className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-500">Account Age</p>
                      <p className="text-white">
                        {stats.accountAge === 0 
                          ? 'Today' 
                          : `${stats.accountAge} ${stats.accountAge === 1 ? 'day' : 'days'}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                    <HiTrendingUp className="w-4 h-4 md:w-5 md:h-5 text-slate-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-500">Account Type</p>
                      <p className="text-white">Premium (Unlimited)</p>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-700/50">
                  <Button
                    variant="outline"
                    className="w-full text-sm"
                    icon={<HiPencil />}
                    onClick={() => toast('Profile editing coming soon!', { icon: '🚧' })}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Stats Grid */}
            <div>
              <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Your Statistics</h3>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="glass" className={cn('border', stat.borderColor)}>
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm text-slate-400 mb-1 md:mb-2">{stat.title}</p>
                            <p className="text-2xl md:text-3xl font-bold text-white truncate">
                              {typeof stat.value === 'number' 
                                ? stat.value.toLocaleString() 
                                : stat.value}
                            </p>
                          </div>
                          <div className={cn(
                            'w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ml-2',
                            stat.bgColor
                          )}>
                            <stat.icon className={cn(
                              'w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br bg-clip-text text-transparent',
                              stat.color
                            )} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Activity Overview */}
            <Card variant="glass">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                <div className="flex items-center justify-between p-3 md:p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <HiChatAlt2 className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-white truncate">Active Chats</p>
                      <p className="text-[10px] md:text-xs text-slate-400 truncate">Conversations in progress</p>
                    </div>
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-cyan-400 flex-shrink-0 ml-2">{stats.totalChats}</span>
                </div>

                <div className="flex items-center justify-between p-3 md:p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <HiBookOpen className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-white truncate">Legal Questions</p>
                      <p className="text-[10px] md:text-xs text-slate-400 truncate">Total questions asked</p>
                    </div>
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-purple-400 flex-shrink-0 ml-2">{stats.questionsAsked}</span>
                </div>

                <div className="flex items-center justify-between p-3 md:p-4 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <HiCheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-white truncate">Most Active Day</p>
                      <p className="text-[10px] md:text-xs text-slate-400 truncate">Your peak activity</p>
                    </div>
                  </div>
                  <span className="text-base md:text-lg font-bold text-emerald-400 flex-shrink-0 ml-2">{stats.mostActiveDay}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card variant="glass">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <Link href="/chat" className="w-full">
                    <Button className="w-full text-xs md:text-sm" size="sm" icon={<HiChatAlt2 />}>
                      Start Chat
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full text-xs md:text-sm"
                    size="sm"
                    icon={<HiBookOpen />}
                    onClick={() => toast('Chat history coming soon!', { icon: '📚' })}
                  >
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card variant="glass" className="border-cyan-500/20 bg-cyan-500/5">
              <CardContent className="p-4 md:p-6">
                <div className="flex gap-3 md:gap-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <HiLightningBolt className="w-4 h-4 md:w-5 md:h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm md:text-base font-semibold text-white mb-1">Pro Tip</h4>
                    <p className="text-sm text-slate-300">
                      Pin important conversations to keep them at the top of your chat list. 
                      This helps you quickly access frequently referenced legal information.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone - Delete Account */}
            <Card variant="glass" className="border-red-500/20 bg-red-500/5">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-base md:text-lg text-red-400">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0">
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <h4 className="text-sm md:text-base font-semibold text-white mb-1">Delete Account</h4>
                    <p className="text-xs md:text-sm text-slate-300 mb-3 md:mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                      All your chats, messages, and profile information will be permanently removed.
                    </p>
                  </div>

                  {!showDeleteConfirm ? (
                    <Button
                      variant="outline"
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isDeleting}
                    >
                      Delete Account
                    </Button>
                  ) : (
                    <div className="space-y-2 md:space-y-3 p-3 md:p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p className="text-xs md:text-sm font-semibold text-red-400">
                        ⚠️ Are you absolutely sure?
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-300">
                        This will immediately delete:
                      </p>
                      <ul className="text-[10px] md:text-xs text-slate-300 list-disc list-inside space-y-1">
                        <li>Your user account</li>
                        <li>All chat history ({stats.totalChats} chats)</li>
                        <li>All messages ({stats.totalMessages} messages)</li>
                        <li>Your profile information</li>
                      </ul>
                      <div className="flex gap-2 mt-3 md:mt-4">
                        <Button
                          variant="outline"
                          className="flex-1 text-xs md:text-sm border-slate-600 text-slate-300"
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm"
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deleting...' : 'Yes, Delete Forever'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
