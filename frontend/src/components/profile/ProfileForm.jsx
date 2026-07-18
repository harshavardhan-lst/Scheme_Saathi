import { useState } from 'react'
import { INDIAN_STATES, CATEGORIES, GENDERS, OCCUPATIONS } from '../../constants/profileOptions'
import ErrorBanner from '../ui/ErrorBanner'
import Spinner from '../ui/Spinner'

export default function ProfileForm({ initialValues = {}, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    income: '',
    occupation: '',
    state: '',
    category: '',
    disability: false,
    disability_type: '',
    language_pref: 'en',
    ...initialValues,
  })

  function handle(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function submit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      age: form.age ? parseInt(form.age) : null,
      income: form.income ? parseInt(form.income) : null,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <ErrorBanner message={error} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="profile-name">Full Name</label>
          <input id="profile-name" name="name" value={form.name} onChange={handle}
            className="form-input" placeholder="e.g. Ravi Kumar" />
        </div>
        <div>
          <label className="form-label" htmlFor="profile-age">Age</label>
          <input id="profile-age" name="age" type="number" min="0" max="120" value={form.age} onChange={handle}
            className="form-input" placeholder="e.g. 35" />
        </div>
        <div>
          <label className="form-label" htmlFor="profile-gender">Gender</label>
          <select id="profile-gender" name="gender" value={form.gender} onChange={handle} className="form-select">
            <option value="">Select gender</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="profile-income">Annual Household Income (₹)</label>
          <input id="profile-income" name="income" type="number" min="0" value={form.income} onChange={handle}
            className="form-input" placeholder="e.g. 120000" />
        </div>
        <div>
          <label className="form-label" htmlFor="profile-occupation">Occupation</label>
          <select id="profile-occupation" name="occupation" value={form.occupation} onChange={handle} className="form-select">
            <option value="">Select occupation</option>
            {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="profile-state">State of Residence</label>
          <select id="profile-state" name="state" value={form.state} onChange={handle} className="form-select">
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="profile-category">Social Category</label>
          <select id="profile-category" name="category" value={form.category} onChange={handle} className="form-select">
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="profile-lang">Preferred Language</label>
          <select id="profile-lang" name="language_pref" value={form.language_pref} onChange={handle} className="form-select">
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="te">తెలుగు</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-card bg-gov-bg border border-gov-border">
        <input id="profile-disability" name="disability" type="checkbox" checked={form.disability}
          onChange={handle} className="w-5 h-5 accent-primary-600 cursor-pointer" />
        <label htmlFor="profile-disability" className="text-sm text-gov-text cursor-pointer">
          Person with Disability
        </label>
      </div>

      {form.disability && (
        <div>
          <label className="form-label" htmlFor="profile-disability-type">Disability Type (optional)</label>
          <input id="profile-disability-type" name="disability_type" value={form.disability_type} onChange={handle}
            className="form-input" placeholder="e.g. Visual impairment, Locomotor disability" />
        </div>
      )}

      <button type="submit" id="save-profile-btn" className="btn-primary w-full justify-center py-3 min-h-[48px]" disabled={loading}>
        {loading ? <Spinner size="sm" /> : 'Save Profile'}
      </button>
    </form>
  )
}
