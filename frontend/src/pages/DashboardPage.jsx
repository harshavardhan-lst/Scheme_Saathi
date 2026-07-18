import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageWrapper from '../components/layout/PageWrapper'
import ProfileCompletionCard from '../components/ui/ProfileCompletionCard'
import SectionHeader from '../components/ui/SectionHeader'
import GovCard from '../components/ui/GovCard'
import SchemeCard from '../components/scheme/SchemeCard'
import { getProfile } from '../services/profile'
import { getRecommendations } from '../services/recommend'
import { getSchemes } from '../services/schemes'
import {
  Star, MessageSquare, User, Search, ChevronRight,
  Megaphone, MapPin, Clock, FileText, Sparkles, ArrowRight
} from 'lucide-react'

const quickActions = [
  { to: '/search', icon: Search, label: 'Find Schemes', desc: 'Search across Central & State government schemes', color: 'bg-blue-50 text-primary-600 border-blue-100' },
  { to: '/recommendations', icon: Star, label: 'My Recommendations', desc: 'View schemes matched to your profile', color: 'bg-amber-50 text-gov-warning border-amber-100' },
  { to: '/chat', icon: MessageSquare, label: 'AI Assistant', desc: 'Get help understanding schemes in plain language', color: 'bg-green-50 text-gov-success border-green-100' },
  { to: '/profile', icon: User, label: 'Update Profile', desc: 'Improve your eligibility matching accuracy', color: 'bg-purple-50 text-purple-600 border-purple-100' },
]

const announcements = [
  { id: 1, title: 'PM-KISAN 18th Installment Released', desc: 'Eligible farmers can check payment status on the official portal.', date: 'Jul 2026', tag: 'Central' },
  { id: 2, title: 'National Scholarship Portal Open', desc: 'Applications for 2026-27 academic year are now being accepted.', date: 'Jun 2026', tag: 'Education' },
  { id: 3, title: 'PM Vishwakarma Scheme Expanded', desc: 'Artisan and craftsperson registration extended to new categories.', date: 'May 2026', tag: 'Central' },
]

const recentActivity = [
  { id: 1, action: 'Viewed scheme details', scheme: 'PM-KISAN', time: '2 hours ago', icon: FileText },
  { id: 2, action: 'Asked AI Assistant', scheme: 'Farmer schemes in Telangana', time: '1 day ago', icon: MessageSquare },
  { id: 3, action: 'Updated profile', scheme: 'Added occupation details', time: '3 days ago', icon: User },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [stateSchemes, setStateSchemes] = useState([])
  const [loadingRecs, setLoadingRecs] = useState(true)

  useEffect(() => {
    getProfile().then((r) => setProfile(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    getRecommendations()
      .then((res) => setRecommendations((res.data.recommendations || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoadingRecs(false))
  }, [])

  useEffect(() => {
    if (profile?.state) {
      getSchemes({ q: profile.state, page: 1, page_size: 3 })
        .then((res) => setStateSchemes(res.data.data || []))
        .catch(() => {})
    }
  }, [profile?.state])

  const firstName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Citizen'

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gov-text mb-2">
          Welcome, {firstName}
        </h1>
        <p className="text-gov-muted">Your personal government scheme discovery portal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <ProfileCompletionCard profile={profile} />
        </div>
        <GovCard className="p-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Sparkles size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="font-semibold text-gov-text text-sm">Need Help?</p>
              <p className="text-xs text-gov-muted">Ask our digital assistant</p>
            </div>
          </div>
          <Link to="/chat" className="btn-primary w-full justify-center min-h-[44px]">
            Open AI Assistant
          </Link>
        </GovCard>
      </div>

      <section className="mb-8">
        <SectionHeader title="Quick Actions" description="Common tasks to discover and apply for schemes" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <Link key={a.to} to={a.to}>
              <GovCard interactive className="p-5 h-full flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-card border flex items-center justify-center ${a.color}`}>
                  <a.icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gov-text text-sm mb-1">{a.label}</p>
                  <p className="text-gov-muted text-xs leading-relaxed">{a.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gov-muted mt-auto" />
              </GovCard>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <section>
          <SectionHeader
            title="Recommended Schemes"
            description="Matched to your profile"
            action={
              <Link to="/recommendations" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            }
          />
          {loadingRecs ? (
            <div className="flex justify-center py-12"><div className="spinner w-8 h-8" /></div>
          ) : recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((r) => (
                <SchemeCard
                  key={r.scheme_id}
                  scheme={{ ...r, scheme_id: r.scheme_id, scheme_name: r.scheme_name || r.name }}
                  score={r.score}
                  explanation={r.explanation}
                />
              ))}
            </div>
          ) : (
            <GovCard className="p-6 text-center">
              <Star size={32} className="text-gov-muted mx-auto mb-3" />
              <p className="text-sm text-gov-muted mb-4">Complete your profile to see personalized recommendations.</p>
              <Link to="/profile" className="btn-primary text-sm">Complete Profile</Link>
            </GovCard>
          )}
        </section>

        <section>
          <SectionHeader
            title="Eligible Schemes"
            description="Schemes you may qualify for"
            action={
              <Link to="/recommendations" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                Check eligibility <ArrowRight size={14} />
              </Link>
            }
          />
          <GovCard className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-card bg-green-50 border border-green-100">
                <div className="w-8 h-8 rounded-full bg-gov-success/10 flex items-center justify-center">
                  <Star size={16} className="text-gov-success" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gov-text">Profile-based matching active</p>
                  <p className="text-xs text-gov-muted">We analyze your details against scheme criteria</p>
                </div>
              </div>
              <Link to="/recommendations" className="btn-secondary w-full justify-center min-h-[44px]">
                View Eligible Schemes
              </Link>
              <Link to="/search" className="btn-ghost w-full justify-center text-sm">
                Browse all schemes
              </Link>
            </div>
          </GovCard>
        </section>
      </div>

      {profile?.state && stateSchemes.length > 0 && (
        <section className="mb-8">
          <SectionHeader
            title={`Schemes in ${profile.state}`}
            description="State-specific welfare programs"
            action={
              <Link to="/search" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateSchemes.map((s) => (
              <SchemeCard key={s.scheme_id || s.id} scheme={s} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <section className="lg:col-span-2">
          <SectionHeader title="Government Announcements" description="Latest updates on welfare schemes" />
          <div className="space-y-3">
            {announcements.map((a) => (
              <GovCard key={a.id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Megaphone size={18} className="text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-medium text-gov-text text-sm">{a.title}</h3>
                      <span className="badge-blue">{a.tag}</span>
                    </div>
                    <p className="text-xs text-gov-muted leading-relaxed">{a.desc}</p>
                    <p className="text-[10px] text-gov-muted mt-2">{a.date}</p>
                  </div>
                </div>
              </GovCard>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Recent Activity" description="Your recent actions" />
          <GovCard className="p-4">
            <div className="space-y-4">
              {recentActivity.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-card bg-gov-bg border border-gov-border flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-gov-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gov-text">{item.action}</p>
                      <p className="text-xs text-gov-muted truncate">{item.scheme}</p>
                    </div>
                    <span className="text-[10px] text-gov-muted shrink-0 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </span>
                  </div>
                )
              })}
            </div>
          </GovCard>
        </section>
      </div>

      <section>
        <SectionHeader
          title="Track Applications"
          description="Monitor your document readiness for scheme applications"
        />
        <GovCard className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <FileText size={22} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gov-text text-sm mb-1">Document Checklist Tracker</p>
              <p className="text-xs text-gov-muted">View a scheme and track required documents before applying on the official portal.</p>
            </div>
            <Link to="/recommendations" className="btn-primary shrink-0 min-h-[44px]">
              View Schemes
            </Link>
          </div>
        </GovCard>
      </section>

      {profile && (
        <section className="mt-8">
          <SectionHeader title="Your Profile Summary" description="Details used for scheme matching" />
          <GovCard className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              {[
                ['State', profile.state, MapPin],
                ['Occupation', profile.occupation, User],
                ['Category', profile.category, Star],
                ['Age', profile.age, Clock],
                ['Income', profile.income ? `₹${Number(profile.income).toLocaleString('en-IN')}` : null, FileText],
                ['Disability', profile.disability ? 'Yes' : 'No', User],
              ].map(([k, v, Icon]) => (
                <div key={k} className="bg-gov-bg rounded-card p-3 border border-gov-border">
                  <div className="flex items-center gap-1.5 text-gov-muted mb-1">
                    <Icon size={12} />
                    <span>{k}</span>
                  </div>
                  <p className="text-gov-text font-medium">{v || '—'}</p>
                </div>
              ))}
            </div>
            <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium mt-4">
              Edit profile <ChevronRight size={14} />
            </Link>
          </GovCard>
        </section>
      )}
    </PageWrapper>
  )
}
