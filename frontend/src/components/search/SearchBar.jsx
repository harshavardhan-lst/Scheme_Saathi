import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Search Government Schemes...' }) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gov-muted pointer-events-none" aria-hidden="true" />
      <input
        id="scheme-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-12 pr-28 py-3.5 text-base shadow-card"
        aria-label="Search schemes"
      />
      <button
        type="submit"
        id="scheme-search-btn"
        className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-5 text-sm min-h-[40px]"
      >
        Search
      </button>
    </form>
  )
}
