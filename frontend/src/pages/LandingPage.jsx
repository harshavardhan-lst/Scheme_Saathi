import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Globe2, FileCheck, Search, Users } from 'lucide-react'
import Logo from '../components/ui/Logo'
import GovCard from '../components/ui/GovCard'

const features = [
  { icon: Search, title: 'Smart Scheme Discovery', desc: 'Search and filter 100+ Central & State government welfare schemes instantly.' },
  { icon: ShieldCheck, title: 'Verified Information', desc: 'All scheme details are sourced from official government datasets for accuracy.' },
  { icon: Globe2, title: 'Multilingual Support', desc: 'Discover and understand schemes in English, Hindi, or Telugu.' },
  { icon: FileCheck, title: 'Document Checklist', desc: 'Know exactly which documents you need before applying.' },
]

const personas = [
  { icon: '🌾', title: 'Farmers', desc: 'Crop insurance, subsidies, income support' },
  { icon: '🎓', title: 'Students', desc: 'Scholarships, skill development programs' },
  { icon: '👩‍💼', title: 'Women Entrepreneurs', desc: 'Loans, grants for women-led businesses' },
  { icon: '👴', title: 'Senior Citizens', desc: 'Pension, healthcare welfare schemes' },
  { icon: '♿', title: 'Persons with Disability', desc: 'Assistive devices, welfare programs' },
  { icon: '🏠', title: 'Low-Income Families', desc: 'Housing, food security, healthcare' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-white border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary-700 text-xs font-semibold mb-6">
              <ShieldCheck size={14} />
              Official Government Scheme Portal
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gov-text leading-tight mb-6">
              Discover Every Government Scheme
              <span className="text-primary-600 block mt-1">You're Entitled To</span>
            </h1>

            <p className="text-gov-muted text-lg max-w-2xl mb-8 leading-relaxed">
              SchemeSathi helps Indian citizens find Central and State welfare schemes — matched to your profile, explained in plain language, in your language.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link to="/register" id="hero-register-btn" className="btn-primary text-base py-3 px-8 min-h-[48px]">
                Get Started <ArrowRight size={18} />
              </Link>
              <Link to="/search" id="hero-search-btn" className="btn-secondary text-base py-3 px-8 min-h-[48px]">
                Browse Schemes
              </Link>
            </div>

            <p className="text-gov-muted text-sm mt-6">Free for all citizens • English, हिंदी, తెలుగు</p>
          </div>
        </div>
      </section>

      <section className="bg-gov-bg py-4 border-b border-gov-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-2 text-sm text-gov-muted">
          <Users size={16} className="text-primary-600" />
          <span>Trusted by citizens across India for transparent scheme discovery</span>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-gov-text text-center mb-2">Built for Every Indian Citizen</h2>
        <p className="text-gov-muted text-center mb-10 text-sm max-w-xl mx-auto">
          Whether you're a farmer, student, entrepreneur, or senior citizen — discover the schemes meant for you.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {personas.map((p) => (
            <GovCard key={p.title} className="p-4 text-center">
              <div className="text-3xl mb-2">{p.icon}</div>
              <div className="font-semibold text-gov-text text-sm mb-1">{p.title}</div>
              <div className="text-gov-muted text-xs leading-relaxed">{p.desc}</div>
            </GovCard>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 bg-white rounded-card border border-gov-border mx-4 sm:mx-6 mb-8">
        <h2 className="text-2xl font-bold text-gov-text text-center mb-10">How SchemeSathi Helps You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <GovCard key={f.title} className="p-6">
              <div className="w-11 h-11 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                <f.icon size={22} className="text-primary-600" />
              </div>
              <h3 className="font-semibold text-gov-text mb-2">{f.title}</h3>
              <p className="text-gov-muted text-sm leading-relaxed">{f.desc}</p>
            </GovCard>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <GovCard className="p-10 sm:p-12 text-center bg-primary-600 border-primary-700 text-white">
          <Logo size="lg" showText={false} className="justify-center mb-6 [&>div:first-child]:bg-white [&>div:first-child]:shadow-none [&>div:first-child]:border [&>div:first-child]:border-white"/>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Start Your Scheme Search Today</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Create your profile and get personalized scheme recommendations in seconds.
          </p>
          <Link to="/register" id="cta-register-btn" className="inline-flex items-center gap-2 px-8 py-3 rounded-card bg-white text-primary-700 font-semibold hover:bg-blue-50 transition-colors min-h-[48px]">
            Create Your Profile <ArrowRight size={18} />
          </Link>
        </GovCard>
      </section>
    </div>
  )
}
