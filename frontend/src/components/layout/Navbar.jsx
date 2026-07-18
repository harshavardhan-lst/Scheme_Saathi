import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import Logo from '../ui/Logo'
import {
  LogOut, User, MessageSquare, Search, LayoutDashboard,
  Star, Bell, ChevronDown, Globe, Menu, X, Check, BellRing,
  Compass, ClipboardList, HelpCircle, Clock
} from 'lucide-react'
import { getProfile } from '../../services/profile'
import { getRecommendations } from '../../services/recommend'

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const { language, changeLanguage, languages } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([
        { id: 'welcome', text: 'Welcome to SchemeSathi! Create an account to find eligible schemes.', read: false, time: 'Just now', type: 'welcome' },
        { id: 'search-tip', text: 'Tip: You can use the search bar to browse over 100+ schemes.', read: false, time: '5m ago', type: 'search' }
      ])
      return
    }

    let isMounted = true
    
    Promise.all([
      getProfile().then((r) => r.data).catch(() => null),
      getRecommendations().then((r) => r.data.recommendations || []).catch(() => [])
    ]).then(([profile, recs]) => {
      if (!isMounted) return
      
      const dynamicNotifs = []
      
      if (profile) {
        const incompleteFields = []
        if (!profile.age) incompleteFields.push('Age')
        if (!profile.state) incompleteFields.push('State')
        if (!profile.occupation) incompleteFields.push('Occupation')
        if (profile.income === null || profile.income === undefined) incompleteFields.push('Income')

        if (incompleteFields.length > 0) {
          dynamicNotifs.push({
            id: 'profile-incomplete',
            text: `Please complete your profile (missing: ${incompleteFields.join(', ')}).`,
            read: false,
            time: 'Just now',
            type: 'profile'
          })
        } else {
          dynamicNotifs.push({
            id: 'profile-complete',
            text: 'Your eligibility profile is fully complete and up-to-date!',
            read: true,
            time: '1d ago',
            type: 'profile'
          })
        }
      }

      if (recs && recs.length > 0) {
        dynamicNotifs.push({
          id: 'recs-found',
          text: `You have matched with ${recs.length} government schemes based on your profile!`,
          read: false,
          time: 'Just now',
          type: 'recommendation'
        })

        recs.forEach((r) => {
          if (r.deadline) {
            const daysLeft = Math.ceil((new Date(r.deadline) - new Date()) / (1000 * 60 * 60 * 24))
            if (daysLeft > 0 && daysLeft <= 30) {
              dynamicNotifs.push({
                id: `deadline-${r.scheme_id}`,
                text: `Deadline for ${r.scheme_name || r.name} is in ${daysLeft} days.`,
                read: false,
                time: '1d ago',
                type: 'deadline'
              })
            }
          }
        })
      } else if (profile) {
        dynamicNotifs.push({
          id: 'no-recs',
          text: 'No schemes currently match your profile. Check back for new listings.',
          read: true,
          time: 'Just now',
          type: 'recommendation'
        })
      }

      if (dynamicNotifs.length === 0) {
        dynamicNotifs.push({
          id: 'generic-welcome',
          text: 'Welcome back! Explore schemes or chat with the AI assistant.',
          read: false,
          time: 'Just now',
          type: 'welcome'
        })
      }

      setNotifications(dynamicNotifs)
    })

    return () => {
      isMounted = false
    }
  }, [isAuthenticated])

  const getNotifIcon = (type) => {
    switch (type) {
      case 'profile': return <User size={14} className="text-purple-600" />
      case 'recommendation': return <Star size={14} className="text-gov-warning" />
      case 'deadline': return <Clock size={14} className="text-gov-danger" />
      default: return <Bell size={14} className="text-primary-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length
  const profileRef = useRef(null)
  const langRef = useRef(null)
  const notifRef = useRef(null)

  const isActive = (path) => location.pathname === path

  function handleLogout() {
    logout()
    setProfileDropdownOpen(false)
    navigate('/')
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileDropdownOpen(false)
      if (langRef.current && !langRef.current.contains(event.target)) setLangDropdownOpen(false)
      if (notifRef.current && !notifRef.current.contains(event.target)) setNotifDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) return
        e.preventDefault()
        navigate('/search')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const handleMarkAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

  const authNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Find Schemes', path: '/search', icon: Compass },
    { label: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { label: 'Saved Schemes', path: '/recommendations', icon: Star },
    { label: 'Track Applications', path: '/dashboard', icon: ClipboardList },
    { label: 'Help', path: '/chat', icon: HelpCircle },
  ]

  const publicNavItems = [
    { label: 'Find Schemes', path: '/search', icon: Compass },
    { label: 'Help', path: '/chat', icon: HelpCircle },
  ]

  const navItems = isAuthenticated ? authNavItems : publicNavItems
  const currentLangLabel = languages.find((l) => l.code === language)?.label || 'English'

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gov-border shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="shrink-0 focus-visible:rounded-card">
            <Logo size="sm" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              return (
                <Link
                  key={`${item.path}-${item.label}`}
                  to={item.path}
                  className={active ? 'nav-link-active' : 'nav-link'}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/search')}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-card border border-gov-border bg-gov-bg text-gov-muted hover:text-gov-text hover:border-primary-300 text-xs transition-colors min-h-[40px]"
              aria-label="Search schemes"
            >
              <Search size={14} />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline bg-white text-gov-muted px-1.5 py-0.5 rounded text-[10px] font-mono border border-gov-border">
                /
              </kbd>
            </button>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className={`relative p-2.5 rounded-card border transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center ${
                  notifDropdownOpen
                    ? 'bg-blue-50 border-primary-300 text-primary-700'
                    : 'bg-white border-gov-border text-gov-muted hover:text-gov-text hover:border-primary-300'
                }`}
                aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
                aria-expanded={notifDropdownOpen}
              >
                {unreadCount > 0 ? (
                  <BellRing size={18} className="text-gov-warning animate-pulse" />
                ) : (
                  <Bell size={18} />
                )}
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gov-danger rounded-full animate-ping" aria-hidden="true" />
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-card bg-white border border-gov-border shadow-card-hover p-4 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-gov-border">
                    <div className="flex items-center gap-2">
                      <BellRing size={16} className="text-primary-600" />
                      <span className="font-semibold text-sm text-gov-text">Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-card border text-left flex items-start gap-2.5 ${
                          n.read ? 'bg-gov-bg border-transparent text-gov-muted' : 'bg-blue-50 border-blue-100 text-gov-text'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs leading-relaxed">{n.text}</p>
                          <span className="text-[10px] text-gov-muted block mt-1">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`p-2.5 sm:px-3 rounded-card border flex items-center gap-1.5 text-xs transition-colors min-h-[40px] ${
                  langDropdownOpen
                    ? 'bg-blue-50 border-primary-300 text-primary-700'
                    : 'bg-white border-gov-border text-gov-muted hover:text-gov-text hover:border-primary-300'
                }`}
                aria-label="Select language"
                aria-expanded={langDropdownOpen}
              >
                <Globe size={16} />
                <span className="hidden md:inline font-medium">{currentLangLabel}</span>
                <ChevronDown size={12} className={`transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-card bg-white border border-gov-border shadow-card-hover p-1.5 z-50 animate-fade-in">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { changeLanguage(l.code); setLangDropdownOpen(false) }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-card text-xs font-medium text-left transition-colors min-h-[40px] ${
                        language === l.code ? 'bg-primary-600 text-white' : 'text-gov-muted hover:text-gov-text hover:bg-gov-bg'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center p-1 rounded-full border border-gov-border hover:border-primary-300 transition-colors min-h-[40px] min-w-[40px]"
                  aria-label="User profile menu"
                  aria-expanded={profileDropdownOpen}
                >
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-xs uppercase">
                    {user?.email ? user.email.slice(0, 2) : 'U'}
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-card bg-white border border-gov-border shadow-card-hover p-1.5 z-50 animate-fade-in">
                    <div className="px-3 py-2.5 border-b border-gov-border mb-1 text-left">
                      <span className="text-xs text-gov-muted block">Signed in as</span>
                      <span className="text-xs font-semibold text-gov-text truncate block">{user?.email}</span>
                    </div>
                    <Link to="/profile" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-card text-xs font-medium text-gov-muted hover:text-gov-text hover:bg-gov-bg min-h-[40px]">
                      <User size={14} /> My Profile
                    </Link>
                    <Link to="/dashboard" onClick={() => setProfileDropdownOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-card text-xs font-medium text-gov-muted hover:text-gov-text hover:bg-gov-bg min-h-[40px]">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-card text-xs font-medium text-gov-danger hover:bg-red-50 min-h-[40px]">
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs font-semibold min-h-[40px]">Sign In</Link>
                <Link to="/register" className="btn-primary text-xs min-h-[40px]">Get Started</Link>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-card border border-gov-border text-gov-muted hover:text-gov-text min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-gov-border py-3 animate-fade-in" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={`mobile-${item.path}-${item.label}`}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-card text-sm font-medium min-h-[48px] ${
                      active ? 'bg-blue-50 text-primary-700' : 'text-gov-muted hover:text-gov-text hover:bg-gov-bg'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                )
              })}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gov-border">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary w-full justify-center min-h-[48px]">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full justify-center min-h-[48px]">Get Started</Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
