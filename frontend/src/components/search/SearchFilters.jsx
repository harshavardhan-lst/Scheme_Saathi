import { INDIAN_STATES, CATEGORIES, GENDERS } from '../../constants/profileOptions'

const INCOME_RANGES = [
  { label: 'Any Income', value: '' },
  { label: 'Below ₹1 Lakh', value: '100000' },
  { label: '₹1–3 Lakh', value: '300000' },
  { label: '₹3–5 Lakh', value: '500000' },
  { label: 'Above ₹5 Lakh', value: '500001' },
]

const AGE_RANGES = [
  { label: 'Any Age', value: '' },
  { label: '18–25', value: '18-25' },
  { label: '26–40', value: '26-40' },
  { label: '41–60', value: '41-60' },
  { label: '60+', value: '60+' },
]

export default function SearchFilters({ filters, onChange }) {
  function update(key, value) {
    onChange({ ...filters, [key]: value })
  }

  const selectClass = 'form-select py-2 text-sm'

  return (
    <div className="gov-card p-4">
      <p className="text-sm font-medium text-gov-text mb-3">Filter Schemes</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div>
          <label className="text-xs text-gov-muted mb-1 block" htmlFor="filter-state">State</label>
          <select id="filter-state" value={filters.state} onChange={(e) => update('state', e.target.value)} className={selectClass}>
            <option value="">All States</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gov-muted mb-1 block" htmlFor="filter-category">Category</label>
          <select id="filter-category" value={filters.category} onChange={(e) => update('category', e.target.value)} className={selectClass}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gov-muted mb-1 block" htmlFor="filter-income">Income</label>
          <select id="filter-income" value={filters.income} onChange={(e) => update('income', e.target.value)} className={selectClass}>
            {INCOME_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gov-muted mb-1 block" htmlFor="filter-gender">Gender</label>
          <select id="filter-gender" value={filters.gender} onChange={(e) => update('gender', e.target.value)} className={selectClass}>
            <option value="">All</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gov-muted mb-1 block" htmlFor="filter-age">Age</label>
          <select id="filter-age" value={filters.age} onChange={(e) => update('age', e.target.value)} className={selectClass}>
            {AGE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
